"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, ColumnDef } from "@/components/ui/Table";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { getNewsletterSubscribers, broadcastNewsletter } from "@/lib/api/newsletter";
import { Mail, Send, Users, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Subscriber = { _id: string; email: string; subscribedAt: string };

type BroadcastStatus = "idle" | "sending" | "success" | "error";

const PRESET_TEMPLATES = [
  {
    label: "Monthly Update",
    subject: "NEEZA Monthly Update — [Month Year]",
    ctaPath: "/",
    buildBody: (url: string) => `<h2 style="color:#B75E1A;margin:0 0 12px">Monthly Update</h2>
<p style="color:#374151;line-height:1.7;margin:0 0 16px">
  Here's what happened at NEEZA this month.
</p>
<p style="color:#374151;line-height:1.7;margin:0 0 24px">
  [Write your update here]
</p>
<a href="${url}" style="background:#B75E1A;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
  Learn More →
</a>`,
  },
  {
    label: "New Project Announcement",
    subject: "We've started a new project: [Project Name]",
    ctaPath: "/projects",
    buildBody: (url: string) => `<h2 style="color:#B75E1A;margin:0 0 12px">New Project Underway</h2>
<h3 style="margin:0 0 8px">[Project Name]</h3>
<p style="color:#888;font-size:13px;margin:0 0 16px">📍 [Location] · [Category]</p>
<p style="color:#374151;line-height:1.7;margin:0 0 24px">
  [Project description]
</p>
<a href="${url}" style="background:#B75E1A;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
  View Projects →
</a>`,
  },
  {
    label: "Event / Announcement",
    subject: "NEEZA Announcement: [Title]",
    ctaPath: "/",
    buildBody: (url: string) => `<h2 style="color:#B75E1A;margin:0 0 12px">[Title]</h2>
<p style="color:#374151;line-height:1.7;margin:0 0 24px">
  [Your message here]
</p>
<a href="${url}" style="background:#B75E1A;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
  Read More →
</a>`,
  },
];

const subscriberColumns: ColumnDef<Subscriber>[] = [
  {
    key: "email",
    header: "Email",
    cell: (item) => (
      <span className="font-medium text-neutral-900">{item.email}</span>
    ),
  },
  {
    key: "subscribedAt",
    header: "Subscribed On",
    cell: (item) => formatDate(item.subscribedAt),
  },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState<BroadcastStatus>("idle");
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const fetchSubscribers = useCallback(() => {
    setLoading(true);
    getNewsletterSubscribers()
      .then(setSubscribers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  function applyTemplate(tpl: typeof PRESET_TEMPLATES[number]) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const resolvedUrl = origin ? `${origin}${tpl.ctaPath}` : tpl.ctaPath;
    setSubject(tpl.subject);
    setBody(tpl.buildBody(resolvedUrl));
  }

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setBroadcastStatus("sending");
    setBroadcastMsg("");
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const finalBody = body.trim().replace(/\[URL\]/g, origin || "/");
      const res = await broadcastNewsletter(subject.trim(), finalBody);
      setBroadcastStatus("success");
      setBroadcastMsg(res.message);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to send. Please try again.";
      setBroadcastStatus("error");
      setBroadcastMsg(msg);
    }
  }

  return (
    <>
      <AdminHeader title="Newsletter" />
      <div className="p-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">{subscribers.length}</div>
                <div className="text-sm text-neutral-500">Active Subscribers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-700 mb-1">Auto-triggers active</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  Emails fire automatically when a new blog post is published or a project is marked Completed.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Broadcast Form */}
          <Card className="border border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Send Newsletter
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                Compose and send a broadcast to all {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}.
              </p>

              {/* Preset templates */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 hover:border-primary hover:text-primary transition-colors font-medium"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {broadcastStatus === "success" ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <p className="font-semibold text-neutral-800">{broadcastMsg}</p>
                  <Button
                    variant="outline"
                    onClick={() => { setBroadcastStatus("idle"); setSubject(""); setBody(""); }}
                    className="mt-2"
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBroadcast} className="space-y-4">
                  <Input
                    label="Subject line"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. NEEZA Monthly Update — May 2026"
                    required
                  />
                  <RichTextEditor
                    label="Email body"
                    value={body}
                    onChange={setBody}
                    placeholder="Write your newsletter content here..."
                  />
                  {broadcastStatus === "error" && (
                    <p className="text-red-500 text-sm">{broadcastMsg}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={broadcastStatus === "sending" || !subject.trim() || !body.trim()}
                    className="w-full"
                  >
                    {broadcastStatus === "sending" ? "Sending…" : `Send to ${subscribers.length} Subscriber${subscribers.length !== 1 ? "s" : ""}`}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Subscribers</h2>
              <button
                onClick={fetchSubscribers}
                className="text-xs text-primary hover:underline font-medium"
              >
                Refresh
              </button>
            </div>
            <Table
              data={subscribers}
              columns={subscriberColumns}
              loading={loading}
              emptyMessage="No subscribers yet."
            />
          </div>

        </div>
      </div>
    </>
  );
}
