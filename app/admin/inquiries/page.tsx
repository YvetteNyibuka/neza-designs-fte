"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, type ColumnDef } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Eye, Mail, MailOpen, Reply, ShieldCheck, Trash2 } from "lucide-react";
import {
  deleteContact,
  getContacts,
  markContactRead,
  replyContact,
  updateContactStatus,
  type InquiryStatus,
} from "@/lib/api/contact";
import { toast } from "sonner";
import { toastApiErrors } from "@/lib/apiErrorToast";

interface InquiryReply {
  subject: string;
  message: string;
  sentAt: string;
  sentByUserId?: string;
  sentByEmail?: string;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: InquiryStatus;
  replies: InquiryReply[];
  createdAt: string;
}

type StatusFilter = "all" | InquiryStatus;

const replyTemplates = [
  {
    key: "acknowledge",
    label: "Acknowledge Inquiry",
    subject: "We received your inquiry",
    message:
      "Thank you for contacting NEEZA Designs. We have received your inquiry and our team is reviewing the details. We will follow up with next steps shortly.",
  },
  {
    key: "request-details",
    label: "Request More Details",
    subject: "Request for additional project details",
    message:
      "Thank you for your inquiry. To prepare a precise response, please share additional details on your project timeline, location, and expected scope.",
  },
  {
    key: "schedule-call",
    label: "Schedule Consultation",
    subject: "Let us schedule a consultation",
    message:
      "Thank you for reaching out. We would like to schedule a consultation to discuss your project goals in detail. Please share your preferred date and time.",
  },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyInquiry, setReplyInquiry] = useState<Inquiry | null>(null);
  const [replyTemplate, setReplyTemplate] = useState(replyTemplates[0]!.key);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  function normalizeStatus(status?: InquiryStatus): InquiryStatus {
    return status ?? "new";
  }

  async function fetchInquiries() {
    setLoading(true);
    try {
      const params: { page: number; limit: number; status?: InquiryStatus } = { page, limit };
      if (filter !== "all") params.status = filter;

      const res = await getContacts(params);
      setInquiries(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params: { page: number; limit: number; status?: InquiryStatus } = { page, limit };
    if (filter !== "all") params.status = filter;

    getContacts(params)
      .then((res) => {
        setInquiries(res.data?.data ?? []);
        setTotal(res.data?.total ?? 0);
      })
      .catch((err: unknown) => {
        toastApiErrors(err, "Failed to fetch inquiries");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filter]);

  const displayedInquiries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return inquiries;

    return inquiries.filter((item) =>
      [item.name, item.email, item.subject, item.message]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [inquiries, searchTerm]);

  const unreadCount = inquiries.filter((item) => !item.isRead).length;
  const repliedCount = inquiries.filter((item) => normalizeStatus(item.status) === "replied").length;
  const closedCount = inquiries.filter((item) => normalizeStatus(item.status) === "closed").length;

  function openReplyModal(item: Inquiry) {
    setReplyInquiry(item);
    const defaultTemplate = replyTemplates[0]!;
    setReplyTemplate(defaultTemplate.key);
    setReplySubject(defaultTemplate.subject);
    setReplyMessage(defaultTemplate.message);
  }

  function applyTemplate(key: string) {
    setReplyTemplate(key);
    const template = replyTemplates.find((item) => item.key === key);
    if (!template) return;
    setReplySubject(template.subject);
    setReplyMessage(template.message);
  }

  async function handleToggleRead(item: Inquiry) {
    setBusyId(item._id);
    try {
      await markContactRead(item._id, !item.isRead);
      toast.success(item.isRead ? "Marked as unread" : "Marked as read");
      await fetchInquiries();
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to update inquiry status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteContact(deleteId);
      toast.success("Inquiry deleted");
      setDeleteId(null);
      await fetchInquiries();
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to delete inquiry");
    } finally {
      setDeleting(false);
    }
  }

  async function handleUpdateStatus(item: Inquiry, status: InquiryStatus) {
    setBusyId(item._id);
    try {
      await updateContactStatus(item._id, status);
      toast.success(`Inquiry marked as ${status}`);
      await fetchInquiries();
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to update inquiry status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSendReply() {
    if (!replyInquiry) return;
    if (replySubject.trim().length < 3) {
      toast.error("Reply subject must be at least 3 characters");
      return;
    }
    if (replyMessage.trim().length < 10) {
      toast.error("Reply message must be at least 10 characters");
      return;
    }

    setSendingReply(true);
    try {
      await replyContact(replyInquiry._id, {
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      });
      toast.success("Reply sent and logged");
      setReplyInquiry(null);
      await fetchInquiries();
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  }

  function statusClass(status: InquiryStatus) {
    if (status === "closed") return "text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded-full";
    if (status === "replied") return "text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full";
    return "text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-full";
  }

  const columns: ColumnDef<Inquiry>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <div>
          <div className="font-semibold text-neutral-900">{item.name}</div>
          <div className="text-xs text-neutral-500 mt-0.5">{item.email}</div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cell: (item) => (
        <div>
          <div className="font-medium text-neutral-800">{item.subject}</div>
          <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{item.message}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <span className={statusClass(normalizeStatus(item.status))}>
          {normalizeStatus(item.status).toUpperCase()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      cell: (item) => new Date(item.createdAt).toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedInquiry(item)}
            className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleRead(item)}
            disabled={busyId === item._id}
            className="p-2 rounded-md hover:bg-neutral-100 text-neutral-600 disabled:opacity-60"
            title={item.isRead ? "Mark as unread" : "Mark as read"}
          >
            {item.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
          </button>
          <button
            onClick={() => openReplyModal(item)}
            className="p-2 rounded-md hover:bg-primary/10 text-primary"
            title="Reply by email"
          >
            <Reply className="w-4 h-4" />
          </button>
          {normalizeStatus(item.status) !== "closed" && (
            <button
              onClick={() => handleUpdateStatus(item, "closed")}
              disabled={busyId === item._id}
              className="p-2 rounded-md hover:bg-green-50 text-green-600 disabled:opacity-60"
              title="Mark as closed"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
          {normalizeStatus(item.status) === "closed" && (
            <button
              onClick={() => handleUpdateStatus(item, "replied")}
              disabled={busyId === item._id}
              className="p-2 rounded-md hover:bg-blue-50 text-blue-600 disabled:opacity-60 text-xs font-semibold"
              title="Reopen"
            >
              Reopen
            </button>
          )}
          <button
            onClick={() => setDeleteId(item._id)}
            className="p-2 rounded-md hover:bg-red-50 text-red-500"
            title="Delete inquiry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Inquiries" />

      <div className="p-8 space-y-6 max-w-350">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Visible inquiries</p>
              <p className="text-3xl font-heading font-bold text-neutral-900 mt-2">{inquiries.length}</p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Unread on page</p>
              <p className="text-3xl font-heading font-bold text-neutral-900 mt-2">{unreadCount}</p>
            </CardContent>
          </Card>
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Replied / Closed</p>
              <p className="text-3xl font-heading font-bold text-neutral-900 mt-2">{repliedCount} / {closedCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "new", label: "New" },
            { key: "replied", label: "Replied" },
            { key: "closed", label: "Closed" },
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLoading(true);
                setFilter(item.key as StatusFilter);
                setPage(1);
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-sm text-neutral-500">Loading inquiries...</div>
            ) : (
              <Table
                data={displayedInquiries}
                columns={columns}
                searchable
                onSearch={setSearchTerm}
                searchPlaceholder="Search by name, email, subject, or message..."
                className="p-6"
              />
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            Page {page} • Total {total}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => {
              setLoading(true);
              setPage((p) => p - 1);
            }}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page * limit >= total} onClick={() => {
              setLoading(true);
              setPage((p) => p + 1);
            }}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        title={selectedInquiry ? `Inquiry: ${selectedInquiry.subject}` : "Inquiry"}
        description={selectedInquiry ? `From ${selectedInquiry.name} • ${selectedInquiry.email}` : undefined}
        maxWidth="2xl"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">Original Message</p>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                {selectedInquiry.message}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">Reply History</p>
              {(selectedInquiry.replies ?? []).length === 0 ? (
                <p className="text-sm text-neutral-500">No replies sent yet.</p>
              ) : (
                <div className="space-y-3">
                  {(selectedInquiry.replies ?? []).map((item, index) => (
                    <div key={`${item.sentAt}-${index}`} className="border border-neutral-100 rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-sm font-semibold text-neutral-800">{item.subject}</p>
                        <p className="text-xs text-neutral-500">{new Date(item.sentAt).toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-neutral-500 mb-2">By {item.sentByEmail ?? "admin"}</p>
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => {
                setSelectedInquiry(null);
                openReplyModal(selectedInquiry);
              }}>Reply</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(replyInquiry)}
        onClose={() => !sendingReply && setReplyInquiry(null)}
        title={replyInquiry ? `Reply to ${replyInquiry.name}` : "Reply"}
        description={replyInquiry?.email}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setReplyInquiry(null)} disabled={sendingReply}>Cancel</Button>
            <Button onClick={handleSendReply} disabled={sendingReply}>{sendingReply ? "Sending..." : "Send Reply"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            type="select"
            label="Template"
            value={replyTemplate}
            onChange={(e) => applyTemplate((e.target as HTMLSelectElement).value)}
            options={replyTemplates.map((item) => ({ value: item.key, label: item.label }))}
          />
          <Input
            label="Subject"
            value={replySubject}
            onChange={(e) => setReplySubject((e.target as HTMLInputElement).value)}
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Reply Message</label>
            <textarea
              rows={8}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => !deleting && setDeleteId(null)}
        title="Delete Inquiry"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">Are you sure you want to permanently delete this inquiry?</p>
      </Modal>
    </>
  );
}
