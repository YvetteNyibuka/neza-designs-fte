"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createPublication, deletePublication, getPublications, updatePublication } from "@/lib/api/publications";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { toastApiErrors, parseApiFieldErrors } from "@/lib/apiErrorToast";
import type { Publication } from "@/types";

type PublicationForm = {
  title: string;
  summary: string;
  type: Publication["type"];
  fileUrl: string;
  externalUrl: string;
  coverImage: string;
  tags: string;
};

const emptyForm: PublicationForm = {
  title: "",
  summary: "",
  type: "Report",
  fileUrl: "",
  externalUrl: "",
  coverImage: "",
  tags: "",
};

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState<PublicationForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      fileUrl: item.fileUrl ?? "",
      externalUrl: item.externalUrl ?? "",
      coverImage: item.coverImage ?? "",
      tags: item.tags.join(", "),
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function onSave() {
    if (!form.title.trim() || !form.summary.trim()) {
      toast.error("Title and summary are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      type: form.type,
      fileUrl: form.fileUrl.trim() || undefined,
      externalUrl: form.externalUrl.trim() || undefined,
      coverImage: form.coverImage.trim() || undefined,
      tags: form.tags.split(",").map((v) => v.trim()).filter(Boolean),
      publishedAt: new Date().toISOString(),
    };

    try {
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
    }
  }

  async function onDelete(item: Publication) {
    try {
      await deletePublication(item.slug);
      toast.success("Publication deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete publication");
    }
  }

  return (
    <>
      <AdminHeader title="Publications" actions={<Button onClick={openCreate}>New Publication</Button>} />
      <div className="p-8 max-w-350">
        {loading ? <p className="text-neutral-500">Loading...</p> : null}
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.type}</p>
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{item.summary}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="destructive" onClick={() => onDelete(item)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Publication" : "New Publication"}>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
            {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Summary</label>
            <textarea rows={4} className={`w-full border rounded-lg px-3 py-2 ${fieldErrors.summary ? "border-red-400" : "border-neutral-200"}`} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
            {fieldErrors.summary && <p className="text-red-500 text-xs mt-1">{fieldErrors.summary}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Publication["type"] }))}>
              {(["Report", "Portfolio", "Law", "Policy", "Guide", "Other"] as const).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <ImageUpload label="Cover Image" folder="publications" value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} />
          <Input label="File URL" value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: (e.target as HTMLInputElement).value }))} />
          <Input label="External URL" value={form.externalUrl} onChange={(e) => setForm((f) => ({ ...f, externalUrl: (e.target as HTMLInputElement).value }))} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: (e.target as HTMLInputElement).value }))} />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={onSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
