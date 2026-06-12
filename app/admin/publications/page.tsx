"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@iconify/react";
import { createPublication, deletePublication, getPublications, updatePublication } from "@/lib/api/publications";
import { uploadImage, uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import { toastApiErrors, parseApiFieldErrors } from "@/lib/apiErrorToast";
import type { Publication } from "@/types";
import { AdminEmptyState } from "@/components/ui/AdminEmptyState";

type PublicationForm = {
  title: string;
  summary: string;
  type: Publication["type"];
  externalUrl: string;
  file: File | null;
  coverImageFile: File | null;
};

const emptyForm: PublicationForm = {
  title: "",
  summary: "",
  type: "Report",
  externalUrl: "",
  file: null,
  coverImageFile: null,
};

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState<PublicationForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await getPublications({ limit: 100 }).catch(() => null);
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
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEdit(item: Publication) {
    setEditing(item);
    setForm({
      title: item.title,
      summary: item.summary,
      type: item.type,
      externalUrl: item.externalUrl ?? "",
      file: null,
      coverImageFile: null,
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function onSave() {
    if (!form.title.trim() || !form.summary.trim()) {
      toast.error("Title and summary are required");
      return;
    }

    setSaving(true);
    try {
      // Upload files first (same pattern as blogs), then send plain JSON
      let coverImageUrl: string | undefined;
      let fileUrl: string | undefined;

      if (form.coverImageFile) {
        const result = await uploadImage(form.coverImageFile, "publications/covers");
        coverImageUrl = result.url;
      }
      if (form.file) {
        const result = await uploadFile(form.file, "publications/files");
        fileUrl = result.url;
      }

      const payload: Partial<import("@/types").Publication> = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        type: form.type,
        ...(form.externalUrl.trim() ? { externalUrl: form.externalUrl.trim() } : {}),
        ...(!editing ? { publishedAt: new Date().toISOString() } : {}),
        ...(coverImageUrl ? { coverImage: coverImageUrl } : {}),
        ...(fileUrl ? { fileUrl } : {}),
      };

      if (editing) {
        await updatePublication(editing.slug, payload);
        toast.success("Publication updated");
      } else {
        await createPublication(payload);
        toast.success("Publication created");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err: unknown) {
      setFieldErrors(parseApiFieldErrors(err));
      toastApiErrors(err, "Failed to save publication");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: Publication) {
    setDeletingSlug(item.slug);
    try {
      await deletePublication(item.slug);
      toast.success("Publication deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete publication");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <>
      <AdminHeader title="Publications" actions={<Button onClick={openCreate}>New Publication</Button>} />
      <div className="p-8 max-w-350">
        {loading ? (
          <AdminEmptyState icon="mdi:loading" title="Loading publications…" />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon="mdi:file-document-multiple-outline"
            title="No publications yet"
            description="Add your first publication — reports, portfolios, guides or policy documents."
            action={{ label: "Add Publication", onClick: openCreate }}
          />
        ) : null}
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex gap-4">
                {item.coverImage && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                    <Image src={item.coverImage} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.type}</p>
                  <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{item.summary}</p>
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
                      <Icon icon="mdi:file-document-outline" className="w-3.5 h-3.5" /> View document
                    </a>
                  )}
                  {!item.fileUrl && item.externalUrl && (
                    <a href={item.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
                      <Icon icon="mdi:open-in-new" className="w-3.5 h-3.5" /> External link
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="destructive" onClick={() => onDelete(item)} disabled={deletingSlug === item.slug}>
                  {deletingSlug === item.slug
                    ? <span className="flex items-center gap-1.5"><Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />Deleting...</span>
                    : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Publication" : "New Publication"} maxWidth="2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          {/* Title */}
          <div>
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
            {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Summary</label>
            <textarea rows={4} className={`w-full border rounded-lg px-3 py-2 text-sm ${fieldErrors.summary ? "border-red-400" : "border-neutral-200"}`} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
            {fieldErrors.summary && <p className="text-red-500 text-xs mt-1">{fieldErrors.summary}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Publication["type"] }))}>
              {(["Report", "Portfolio", "Law", "Policy", "Guide", "Other"] as const).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image</label>
            {editing?.coverImage && !form.coverImageFile && (
              <div className="flex items-center gap-3 mb-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={editing.coverImage} alt="current cover" fill style={{ objectFit: "cover" }} unoptimized />
                </div>
                <span className="text-xs text-neutral-500 flex-1 truncate">Current cover image</span>
                <span className="text-xs text-neutral-400 italic">Upload below to replace</span>
              </div>
            )}
            {form.coverImageFile ? (
              <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <Icon icon="mdi:image-outline" className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-sm text-blue-800 truncate">{form.coverImageFile.name}</span>
                <button type="button" onClick={() => { setForm((f) => ({ ...f, coverImageFile: null })); if (coverInputRef.current) coverInputRef.current.value = ""; }} className="text-blue-500 hover:text-blue-700">
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                <Icon icon="mdi:upload" className="w-5 h-5" />
                {editing?.coverImage ? "Upload replacement cover image" : "Upload cover image"}
                <span className="text-xs text-neutral-400">(JPEG, PNG, WebP)</span>
              </button>
            )}
            <input ref={coverInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0] ?? null; setForm((prev) => ({ ...prev, coverImageFile: f })); }} />
          </div>

          {/* Document File */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Document File <span className="text-neutral-400 font-normal">(PDF or Word)</span></label>
            {editing?.fileUrl && !form.file && (
              <div className="flex items-center gap-3 mb-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                <Icon icon="mdi:file-document-outline" className="w-5 h-5 text-neutral-500 shrink-0" />
                <span className="text-xs text-neutral-500 flex-1 truncate">{editing.fileUrl.split("/").pop()?.split("?")[0] ?? "Current document"}</span>
                <a href={editing.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline shrink-0">View</a>
                <span className="text-xs text-neutral-400 italic shrink-0">Upload below to replace</span>
              </div>
            )}
            {form.file ? (
              <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <Icon icon="mdi:file-document-outline" className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="flex-1 text-sm text-blue-800 truncate">{form.file.name}</span>
                <button type="button" onClick={() => { setForm((f) => ({ ...f, file: null })); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-blue-500 hover:text-blue-700">
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                <Icon icon="mdi:upload" className="w-5 h-5" />
                {editing?.fileUrl ? "Upload replacement document" : "Upload document"}
                <span className="text-xs text-neutral-400">(PDF, DOC, DOCX)</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => { const f = e.target.files?.[0] ?? null; setForm((prev) => ({ ...prev, file: f })); }} />
          </div>

          {/* External URL (optional) */}
          <div>
            <Input label="External URL (optional)" placeholder="https://..." value={form.externalUrl} onChange={(e) => setForm((f) => ({ ...f, externalUrl: (e.target as HTMLInputElement).value }))} />
            <p className="text-xs text-neutral-400 mt-0.5">Use this if the document is hosted externally (no file upload needed).</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={onSave} disabled={saving}>
              {saving
                ? <span className="flex items-center gap-2"><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />{editing ? "Updating..." : "Creating..."}</span>
                : (editing ? "Update" : "Create")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}