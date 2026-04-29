"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Edit, ArrowRight, Trash2, Plus, Search } from "lucide-react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getServices, createService, updateService, deleteService } from "@/lib/api/services";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateServiceForm } from "@/lib/formValidation";
import type { Service } from "@/types";

type FeatureForm = { name: string; meaning: string; icon: string };

function IconifySearchInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(trimmed)}&limit=16`);
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { icons?: string[] };
        setResults(Array.isArray(data.icons) ? data.icons : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [open, query]);

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <div className="relative" onBlur={() => setTimeout(() => setOpen(false), 120)}>
        <div className="flex items-center gap-2 w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus-within:ring-1 focus-within:ring-primary">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              onChange(next);
              setOpen(true);
            }}
            className="w-full outline-none"
            placeholder="Search icons (e.g. check, map, home)"
          />
          <div className="shrink-0 rounded-md border border-neutral-200 bg-neutral-50 p-1.5">
            <Icon icon={value || "mdi:help-circle-outline"} className="w-4 h-4 text-neutral-700" />
          </div>
        </div>

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg max-h-56 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-xs text-neutral-500">Searching icons...</div>
            ) : results.length > 0 ? (
              <div className="py-1">
                {results.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(iconName);
                      setQuery(iconName);
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Icon icon={iconName} className="w-4 h-4 text-neutral-700" />
                    <span className="text-neutral-700">{iconName}</span>
                  </button>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="px-3 py-2 text-xs text-neutral-500">No icons found</div>
            ) : (
              <div className="px-3 py-2 text-xs text-neutral-500">Type at least 2 characters to search</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const emptyForm = {
  title: "",
  shortDescription: "",
  imageUrl: "",
  buttonTitle: "",
  features: [{ name: "", meaning: "", icon: "mdi:check-circle-outline" }] as FeatureForm[],
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const res = await getServices().catch(() => null);
    if (res) setServices(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(svc: Service) {
    const normalizedFeatures: FeatureForm[] = Array.isArray(svc.features)
      ? svc.features.map((f) => {
          if (typeof f === "string") {
            return { name: f, meaning: f, icon: "mdi:check-circle-outline" };
          }
          return {
            name: f.name ?? "",
            meaning: f.meaning ?? "",
            icon: f.icon ?? "mdi:check-circle-outline",
          };
        })
      : [];

    setEditing(svc);
    setForm({
      title: svc.title,
      shortDescription: svc.shortDescription,
      imageUrl: svc.imageUrl,
      buttonTitle: svc.buttonTitle ?? "",
      features: normalizedFeatures.length > 0 ? normalizedFeatures : emptyForm.features,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    const validationErrors = validateServiceForm(form);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
        buttonTitle: form.buttonTitle.trim() || undefined,
        features: form.features.map((feature) => ({
          name: feature.name.trim(),
          meaning: feature.meaning.trim(),
          icon: feature.icon.trim(),
        })),
      };
      if (editing) {
        await updateService(editing._id, payload);
      } else {
        await createService(payload);
      }
      setModalOpen(false);
      fetchServices();
      toast.success(editing ? "Service updated" : "Service created");
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(id: string) {
    setDeleteServiceId(id);
  }

  async function confirmDelete() {
    if (!deleteServiceId) return;
    setDeleting(true);
    await deleteService(deleteServiceId).then(() => {
      toast.success("Service deleted");
      setDeleteServiceId(null);
    }).catch((err: unknown) => {
      toastApiErrors(err, "Failed to delete service");
    });
    await fetchServices();
    setDeleting(false);
  }

  function addFeature() {
    setForm((f) => ({
      ...f,
      features: [...f.features, { name: "", meaning: "", icon: "mdi:check-circle-outline" }],
    }));
  }

  function updateFeature(index: number, field: keyof FeatureForm, value: string) {
    setForm((f) => ({
      ...f,
      features: f.features.map((feature, i) => (i === index ? { ...feature, [field]: value } : feature)),
    }));
  }

  function removeFeature(index: number) {
    setForm((f) => ({
      ...f,
      features: f.features.length === 1 ? f.features : f.features.filter((_, i) => i !== index),
    }));
  }

  return (
    <>
      <AdminHeader
        title="Service Management"
        actions={
          <Button className="h-10" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Service
          </Button>
        }
      />

      <div className="p-8 max-w-350">
        {loading ? (
          <div className="text-center text-neutral-400 py-16 text-sm">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((svc, idx) => (
              <div key={svc._id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-64 w-full group">
                  {svc.imageUrl ? (
                    <Image src={svc.imageUrl} alt={svc.title} fill style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => openEdit(svc)} className="w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-md flex items-center justify-center text-white transition-colors border border-white/20">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => openDeleteDialog(svc._id)} className="w-10 h-10 bg-black/20 hover:bg-red-500/60 backdrop-blur-md rounded-md flex items-center justify-center text-white transition-colors border border-white/20">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-[#1C1C1C]/40 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded inline-block mb-3">
                      <span className="text-white drop-shadow-md">DEPT {String.fromCharCode(65 + idx)}{idx + 1}</span>
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-white drop-shadow-md line-clamp-1">{svc.title}</h3>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-neutral-600 leading-relaxed mb-8 text-sm">{svc.shortDescription}</p>
                  <div className="mb-auto">
                    <h4 className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2 mb-4">
                      <ArrowRight className="w-3 h-3 rotate-45" /> FEATURES
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {svc.features?.map((f, i) => (
                        <span key={i} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-[11px] font-bold text-neutral-600">
                          {typeof f === "string" ? f : (f as { name: string }).name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-end">
                    <button onClick={() => openEdit(svc)} className="text-sm font-bold text-primary flex items-center gap-2 hover:text-primary-dark transition-colors group">
                      Edit Service Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Service" : "New Service"} maxWidth="2xl" >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
          <ImageUpload label="Service Image" folder="services" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <Input label="Button Title" value={form.buttonTitle} onChange={(e) => setForm((f) => ({ ...f, buttonTitle: (e.target as HTMLInputElement).value }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Short Description</label>
            <textarea rows={2} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700">Features</label>
              <button type="button" onClick={addFeature} className="text-xs font-semibold text-primary hover:underline">
                + Add feature
              </button>
            </div>
            {form.features.map((feature, index) => (
              <div key={index} className="space-y-2 border border-neutral-200 rounded-lg p-3 bg-neutral-50/50">
                <Input
                  label={`Feature ${index + 1} Name`}
                  value={feature.name}
                  onChange={(e) => updateFeature(index, "name", (e.target as HTMLInputElement).value)}
                />
                <Input
                  label="Meaning"
                  value={feature.meaning}
                  onChange={(e) => updateFeature(index, "meaning", (e.target as HTMLInputElement).value)}
                />
                <IconifySearchInput
                  label="Icon (Iconify key)"
                  value={feature.icon}
                  onChange={(value) => updateFeature(index, "icon", value)}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    disabled={form.features.length === 1}
                    className="text-xs text-red-500 disabled:text-neutral-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteServiceId)}
        onClose={() => !deleting && setDeleteServiceId(null)}
        title="Delete Service"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteServiceId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">Are you sure you want to delete this service?</p>
      </Modal>
    </>
  );
}

