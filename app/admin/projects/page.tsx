"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Edit, Leaf, MonitorSmartphone, CheckCircle, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/api/projects";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateProjectForm } from "@/lib/formValidation";
import type { Project } from "@/types";

const CATEGORIES = ["Architecture", "Civil Engineering", "Project Management", "Masterplanning", "Interior"] as const;
const STATUSES = ["Completed", "Ongoing"] as const;

const emptyForm = { title: "", category: "Architecture" as Project["category"], status: "Ongoing" as Project["status"], description: "", imageUrl: "", location: "", client: "", completionYear: "" };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All Projects");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit, search };
    if (activeTab === "Ongoing (ongoing)") params.status = "Ongoing";
    if (activeTab === "Completed (completed)") params.status = "Completed";
    const res = await getProjects(params).catch(() => null);
    if (res) {
      setProjects(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    }
    setLoading(false);
  }, [page, search, activeTab]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      title: project.title,
      category: project.category,
      status: project.status,
      description: project.description,
      imageUrl: project.imageUrl,
      location: project.location ?? "",
      client: project.client ?? "",
      completionYear: project.completionYear ? String(project.completionYear) : "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    const validationErrors = validateProjectForm(form);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        client: form.client.trim(),
        completionYear: form.completionYear ? Number(form.completionYear) : undefined,
      };
      if (editing) {
        await updateProject(editing.slug, payload);
      } else {
        await createProject(payload);
      }
      setModalOpen(false);
      fetchProjects();
      toast.success(editing ? "Project updated" : "Project created");
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(slug: string) {
    setDeleteSlug(slug);
  }

  async function confirmDelete() {
    if (!deleteSlug) return;
    setDeleting(true);
    await deleteProject(deleteSlug).then(() => {
      toast.success("Project deleted");
      setDeleteSlug(null);
    }).catch((err: unknown) => {
      toastApiErrors(err, "Failed to delete project");
    });
    await fetchProjects();
    setDeleting(false);
  }

  const tabs = [`All Projects (${total})`, "Ongoing", "Completed"];

  const columns: ColumnDef<Project>[] = [
    {
      key: "title",
      header: "PROJECT NAME",
      cell: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-50 text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
          </div>
          <span className="font-bold text-neutral-900">{item.title}</span>
        </div>
      ),
    },
    { key: "client", header: "CLIENT" },
    {
      key: "location",
      header: "LOCATION",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-neutral-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {item.location}
        </div>
      ),
    },
    { key: "category", header: "CATEGORY" },
    {
      key: "status",
      header: "STATUS",
      cell: (item) => (
        <Badge variant={item.status === "Completed" ? "default" : "secondary"} className={cn("text-[10px] px-2 py-1 tracking-widest uppercase font-bold", item.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (item) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="p-2 border border-neutral-200 rounded-md text-neutral-400 hover:text-primary hover:border-primary transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => openDeleteDialog(item.slug)} className="p-2 border border-neutral-200 rounded-md text-neutral-400 hover:text-red-500 hover:border-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Project Management"
        actions={
          <Button className="h-10" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        }
      />

      <div className="p-8 max-w-350">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Find a project..." className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
          <div className="flex gap-6 text-sm font-bold border-b border-neutral-200 w-full md:w-auto">
            {tabs.map((tab) => (
              <button key={tab} className={cn("pb-3 px-1 relative whitespace-nowrap", activeTab === tab ? "text-primary" : "text-neutral-500")} onClick={() => { setActiveTab(tab); setPage(1); }}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-12">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-sm">Loading…</div>
          ) : (
            <Table data={projects} columns={columns} className="w-full text-sm" />
          )}
          <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Showing <strong className="text-neutral-900">{projects.length}</strong> of <strong className="text-neutral-900">{total}</strong> projects</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50 disabled:opacity-40">&lt;</button>
              <button disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50 disabled:opacity-40">&gt;</button>
            </div>
          </div>
        </div>

        {/* Strategic Initiatives */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-6">Strategic Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F9F6F0] p-8 rounded-xl border border-[#EBE3D5] group hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
              <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-6 bg-white"><Leaf className="w-5 h-5" /></div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 mb-3">Sustainable Infrastructure</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">Focusing on net-zero engineering for upcoming residential projects.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">VIEW ROADMAP &rarr;</div>
            </div>
            <div className="bg-[#F4F4F4] p-8 rounded-xl border border-neutral-200 group hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
              <div className="w-10 h-10 rounded-full text-primary flex items-center justify-center mb-6 bg-white"><MonitorSmartphone className="w-5 h-5" /></div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 mb-3">Smart City Integration</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">Implementing IoT-based traffic and power management in downtown commercial designs.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">EXPLORE TECH &rarr;</div>
            </div>
            <div className="bg-primary text-white p-8 rounded-xl border border-primary-dark group relative overflow-hidden shadow-lg cursor-pointer hover:-translate-y-1 transition-transform">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center mb-6 bg-white/10"><CheckCircle className="w-5 h-5" /></div>
              <h3 className="font-heading font-bold text-lg text-white mb-3">Quick Report</h3>
              <p className="text-sm text-white/80 mb-8 leading-relaxed">Generate an instant status report for all ongoing high-priority projects.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">GENERATE NOW &rarr;</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Project" : "New Project"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Project["category"] }))}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Project["status"] }))}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <ImageUpload label="Cover Image" folder="projects" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: (e.target as HTMLInputElement).value }))} />
          <Input label="Client" value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: (e.target as HTMLInputElement).value }))} />
          <Input label="Completion Year" type="number" value={form.completionYear} onChange={(e) => setForm((f) => ({ ...f, completionYear: (e.target as HTMLInputElement).value }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea rows={4} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteSlug)}
        onClose={() => !deleting && setDeleteSlug(null)}
        title="Delete Project"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteSlug(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">Are you sure you want to delete this project?</p>
      </Modal>
    </>
  );
}
