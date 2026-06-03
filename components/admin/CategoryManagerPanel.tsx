"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createCategory, deleteCategory, getCategories, updateCategory, type CategoryScope } from "@/lib/api/categories";
import type { CategoryItem } from "@/types";
import { toast } from "sonner";
import { toastApiErrors } from "@/lib/apiErrorToast";
import { Edit2, Plus, Trash2, Tags } from "lucide-react";

type CategoryForm = {
  name: string;
  description: string;
  order: string;
};

type CategoryManagerPanelProps = {
  scope: CategoryScope;
  title: string;
  hint: string;
  emptyMessage: string;
  createLabel: string;
  onCategoriesChange?: (items: CategoryItem[]) => void;
};

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  order: "0",
};

export function CategoryManagerPanel({
  scope,
  title,
  hint,
  emptyMessage,
  createLabel,
  onCategoriesChange,
}: CategoryManagerPanelProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refreshCategories() {
    setLoading(true);
    try {
      const response = await getCategories(scope);
      const items = response.data.data;
      setCategories(items);
      onCategoriesChange?.(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCategories();
  }, [scope]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(category: CategoryItem) {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
      order: String(category.order ?? 0),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      order: Number(form.order) || 0,
    };

    try {
      if (editing) {
        await updateCategory(scope, editing._id!, payload);
        toast.success("Category updated");
      } else {
        await createCategory(scope, payload);
        toast.success("Category created");
      }
      setModalOpen(false);
      await refreshCategories();
    } catch (error: unknown) {
      toastApiErrors(error, "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: CategoryItem) {
    try {
      await deleteCategory(scope, category._id!);
      toast.success("Category deleted");
      setDeleteItemId(null);
      await refreshCategories();
    } catch (error: unknown) {
      toastApiErrors(error, "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  }

  function openDeleteConfirm(category: CategoryItem) {
    setDeleteItemId(category._id!);
  }

  async function confirmDelete() {
    const itemToDelete = categories.find((c) => c._id === deleteItemId);
    if (!itemToDelete) return;
    
    setDeleting(true);
    await handleDelete(itemToDelete);
  }

  const countLabel = useMemo(
    () => `${categories.length} saved item${categories.length === 1 ? "" : "s"}`,
    [categories.length]
  );

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-neutral-900">{title}</h2>
              <p className="text-sm text-neutral-500 mt-1">{hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
                <Tags className="w-4 h-4" />
                {countLabel}
              </div>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" /> {createLabel}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="px-6 py-10 text-sm text-neutral-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-10 text-sm text-neutral-500">{emptyMessage}</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {categories.map((item) => (
                <div key={item._id || item.slug} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-500">Order {item.order ?? 0}</span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-400">{item.slug}</p>
                    {item.description ? <p className="mt-3 text-sm text-neutral-600">{item.description}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteConfirm(item)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : createLabel} maxWidth="lg">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Optional helper text for admins"
            />
          </div>
          <Input label="Display Order" type="number" value={form.order} onChange={(e) => setForm((current) => ({ ...current, order: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteItemId)}
        onClose={() => !deleting && setDeleteItemId(null)}
        title="Delete Category"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteItemId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">Are you sure you want to delete this category?</p>
      </Modal>
    </>
  );
}
