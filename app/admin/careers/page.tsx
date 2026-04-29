"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createCareer, deleteCareer, getCareers, updateCareer } from "@/lib/api/careers";
import { toast } from "sonner";
import { toastApiErrors, parseApiFieldErrors } from "@/lib/apiErrorToast";
import type { Career } from "@/types";
import { getAllApplications, updateApplicationStatus } from "@/lib/api/applications";
import type { JobApplication, ApplicationStatus } from "@/types";
import { Plus, Trash2 } from "lucide-react";

type CareerForm = {
  title: string;
  department: string;
  location: string;
  employmentType: Career["employmentType"];
  experienceLevel: Career["experienceLevel"];
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: Career["status"];
};

const emptyForm: CareerForm = {
  title: "",
  department: "",
  location: "Kigali, Rwanda",
  employmentType: "Full-time",
  experienceLevel: "Mid",
  description: "",
  requirements: [],
  responsibilities: [],
  status: "Open",
};

export default function AdminCareersPage() {
  const [items, setItems] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [form, setForm] = useState<CareerForm>(emptyForm);
  const [activeTab, setActiveTab] = useState<"postings" | "applications">("postings");
  const [selectedCareerForApps, setSelectedCareerForApps] = useState<Career | null>(null);
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [filterJobSlug, setFilterJobSlug] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await getCareers({ limit: 100 }).catch(() => null);
    if (res) setItems(res.data?.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchItems();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchItems]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setRequirementInput("");
    setResponsibilityInput("");
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEdit(item: Career) {
    setEditing(item);
    setForm({
      title: item.title,
      department: item.department,
      location: item.location,
      employmentType: item.employmentType,
      experienceLevel: item.experienceLevel,
      description: item.description,
      requirements: item.requirements,
      responsibilities: item.responsibilities,
      status: item.status,
    });
    setRequirementInput("");
    setResponsibilityInput("");
    setFieldErrors({});
    setModalOpen(true);
  }

  function addRequirement() {
    const value = requirementInput.trim();
    if (!value) return;
    setForm((prev) => ({ ...prev, requirements: [...prev.requirements, value] }));
    setRequirementInput("");
  }

  function removeRequirement(index: number) {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  }

  function addResponsibility() {
    const value = responsibilityInput.trim();
    if (!value) return;
    setForm((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, value] }));
    setResponsibilityInput("");
  }

  function removeResponsibility(index: number) {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  }

  async function onSave() {
    if (!form.title.trim() || !form.department.trim() || !form.description.trim()) {
      toast.error("Title, department and description are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      experienceLevel: form.experienceLevel,
      description: form.description.trim(),
      requirements: form.requirements.map((v) => v.trim()).filter(Boolean),
      responsibilities: form.responsibilities.map((v) => v.trim()).filter(Boolean),
      status: form.status,
    };

    try {
      if (editing) {
        await updateCareer(editing.slug, payload);
        toast.success("Career updated");
      } else {
        await createCareer(payload);
        toast.success("Career created");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err: unknown) {
      setFieldErrors(parseApiFieldErrors(err));
      toastApiErrors(err, "Failed to save career");
    }
  }

  async function onDelete(item: Career) {
    try {
      await deleteCareer(item.slug);
      toast.success("Career deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete career");
    }
  }

  const fetchAllApplications = useCallback(async () => {
    setAppsLoading(true);
    const res = await getAllApplications({ limit: 200 }).catch(() => null);
    setAllApplications(res?.data?.data ?? res?.data ?? []);
    setAppsLoading(false);
  }, []);

  async function loadApplications(career: Career) {
    setSelectedCareerForApps(career);
    setFilterJobSlug(career.slug);
    setFilterStatus("all");
    setActiveTab("applications");
    await fetchAllApplications();
  }

  async function openAllApplications() {
    setSelectedCareerForApps(null);
    setFilterJobSlug("all");
    setFilterStatus("all");
    setActiveTab("applications");
    await fetchAllApplications();
  }

  function clearFilters() {
    setFilterJobSlug("all");
    setFilterStatus("all");
    setSelectedCareerForApps(null);
  }

  const displayedApplications = allApplications.filter((a) => {
    if (filterJobSlug !== "all" && a.careerSlug !== filterJobSlug) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  async function changeStatus(app: JobApplication, status: ApplicationStatus) {
    try {
      await updateApplicationStatus(app._id, status);
      setAllApplications((prev) => prev.map((a) => a._id === app._id ? { ...a, status } : a));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <>
      <AdminHeader
        title="Careers"
        actions={
          <div className="flex gap-2">
            {activeTab === "postings" && <Button onClick={openCreate}>New Job</Button>}
            {activeTab === "applications" && <Button variant="outline" size="sm" onClick={() => setActiveTab("postings")}>← Back to Postings</Button>}
          </div>
        }
      />
      <div className="p-8 max-w-350">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("postings")}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "postings" ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}
          >
            Job Postings
          </button>
          <button
            onClick={() => openAllApplications()}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "applications" ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}
          >
            All Applications
            {allApplications.length > 0 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {allApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* Postings Tab */}
        {activeTab === "postings" && (
          <>
            {loading ? <p className="text-neutral-500">Loading...</p> : null}
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">{item.title}</h3>
                    <p className="text-sm text-neutral-500">{item.department} · {item.location}</p>
                    <p className="text-sm text-neutral-600 mt-2">{item.employmentType} · {item.experienceLevel} · {item.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => loadApplications(item)}>Applications</Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-white border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neutral-600 shrink-0">Filter by Job:</label>
                <select
                  value={filterJobSlug}
                  onChange={(e) => setFilterJobSlug(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm bg-white min-w-48"
                >
                  <option value="all">All Jobs</option>
                  {items.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neutral-600 shrink-0">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | "all")}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm bg-white"
                >
                  <option value="all">All Statuses</option>
                  {(["New", "Reviewing", "Shortlisted", "Rejected", "Hired"] as ApplicationStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {(filterJobSlug !== "all" || filterStatus !== "all") && (
                <button onClick={clearFilters} className="text-xs text-primary underline font-medium">
                  Clear Filters
                </button>
              )}
              <span className="ml-auto text-sm text-neutral-500">{displayedApplications.length} application{displayedApplications.length !== 1 ? "s" : ""}</span>
            </div>

            {appsLoading ? (
              <p className="text-neutral-500 text-sm">Loading...</p>
            ) : displayedApplications.length === 0 ? (
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-neutral-500 text-sm">
                No applications found{filterJobSlug !== "all" || filterStatus !== "all" ? " for the selected filters" : ""}.
              </div>
            ) : (
              <div className="grid gap-4">
                {displayedApplications.map((app) => (
                  <div key={app._id} className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-neutral-900">{app.applicantName}</h4>
                          <span className="text-xs bg-neutral-100 text-neutral-500 rounded-full px-2 py-0.5">{app.careerTitle ?? app.careerSlug}</span>
                        </div>
                        <p className="text-sm text-neutral-500">{app.email}{app.phone ? ` · ${app.phone}` : ""}</p>
                        {app.linkedIn && (
                          <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-1 block">LinkedIn Profile</a>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary underline font-medium">
                              📄 Download CV
                            </a>
                          )}
                          {app.coverLetter && (
                            <a href={app.coverLetter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary underline font-medium">
                              📝 Cover Letter
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-2">Applied {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0 min-w-32">
                        <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full text-center ${app.status === "New" ? "bg-blue-100 text-blue-700" : app.status === "Reviewing" ? "bg-yellow-100 text-yellow-700" : app.status === "Shortlisted" ? "bg-green-100 text-green-700" : app.status === "Hired" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{app.status}</span>
                        <select
                          value={app.status}
                          onChange={(e) => changeStatus(app, e.target.value as ApplicationStatus)}
                          className="text-xs border border-neutral-200 rounded-lg px-2 py-1 bg-white cursor-pointer"
                        >
                          {(["New", "Reviewing", "Shortlisted", "Rejected", "Hired"] as ApplicationStatus[]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Job" : "New Job"} maxWidth="2xl">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
            {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
          </div>
          <div>
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: (e.target as HTMLInputElement).value }))} />
            {fieldErrors.department && <p className="text-red-500 text-xs mt-1">{fieldErrors.department}</p>}
          </div>
          <div>
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: (e.target as HTMLInputElement).value }))} />
            {fieldErrors.location && <p className="text-red-500 text-xs mt-1">{fieldErrors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Employment Type</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2" value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as Career["employmentType"] }))}>
              {(["Full-time", "Part-time", "Contract", "Internship"] as const).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Experience Level</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2" value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value as Career["experienceLevel"] }))}>
              {(["Entry", "Mid", "Senior", "Lead"] as const).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description <span className="text-neutral-400 font-normal">(min 30 characters)</span></label>
            <textarea rows={3} className={`w-full border rounded-lg px-3 py-2 ${fieldErrors.description ? "border-red-400" : "border-neutral-200"}`} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Requirements</label>
            <div className="flex gap-2 mb-2">
              <input
                className="w-full border border-neutral-200 rounded-lg px-3 py-2"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
                placeholder="Add a requirement"
              />
              <Button type="button" variant="outline" onClick={addRequirement} aria-label="Add requirement" className="px-3">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {form.requirements.map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex items-stretch rounded-lg border border-neutral-200 bg-neutral-50 text-sm overflow-hidden">
                  <span className="flex-1 px-3 py-2 text-neutral-700">{item}</span>
                  <div className="flex items-center border-l border-neutral-200 px-2">
                    <button type="button" onClick={() => removeRequirement(idx)} aria-label="Remove requirement" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {fieldErrors.requirements && <p className="text-red-500 text-xs mt-1">{fieldErrors.requirements}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Responsibilities</label>
            <div className="flex gap-2 mb-2">
              <input
                className="w-full border border-neutral-200 rounded-lg px-3 py-2"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addResponsibility();
                  }
                }}
                placeholder="Add a responsibility"
              />
              <Button type="button" variant="outline" onClick={addResponsibility} aria-label="Add responsibility" className="px-3">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {form.responsibilities.map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex items-stretch rounded-lg border border-neutral-200 bg-neutral-50 text-sm overflow-hidden">
                  <span className="flex-1 px-3 py-2 text-neutral-700">{item}</span>
                  <div className="flex items-center border-l border-neutral-200 px-2">
                    <button type="button" onClick={() => removeResponsibility(idx)} aria-label="Remove responsibility" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {fieldErrors.responsibilities && <p className="text-red-500 text-xs mt-1">{fieldErrors.responsibilities}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Career["status"] }))}>
              {(["Open", "Closed"] as const).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={onSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
