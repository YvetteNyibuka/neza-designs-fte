"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/api/team";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateTeamForm } from "@/lib/formValidation";
import type { TeamMember } from "@/types";

const emptyForm = { name: "", role: "", bio: "", imageUrl: "" };

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    const res = await getTeam().catch(() => null);
    if (res) setTeam(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    setForm({ name: member.name, role: member.role, bio: member.bio, imageUrl: member.imageUrl ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    const validationErrors = validateTeamForm(form);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        imageUrl: form.imageUrl,
      };
      if (editing) {
        await updateTeamMember(editing._id, payload);
      } else {
        await createTeamMember(payload);
      }
      setModalOpen(false);
      fetchTeam();
      toast.success(editing ? "Team member updated" : "Team member created");
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to save team member");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(id: string) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await deleteTeamMember(deleteId).then(() => {
      toast.success("Team member deleted");
      setDeleteId(null);
    }).catch((err: unknown) => {
      toastApiErrors(err, "Failed to delete team member");
    });
    await fetchTeam();
    setDeleting(false);
  }

  return (
    <>
      <AdminHeader
        title="Team Management"
        actions={
          <Button className="h-11 px-6 bg-primary hover:bg-primary-dark text-white shadow-sm font-bold" onClick={openCreate}>
            <Plus className="w-5 h-5 mr-2" /> Add Team Member
          </Button>
        }
      />

      <div className="p-8 max-w-350">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-8 flex justify-end">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team members…" className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-neutral-400 py-16 text-sm">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((user) => (
              <div key={user._id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden relative ring-4 ring-[#F7EFEA] group-hover:ring-primary/20 transition-all">
                    {user.imageUrl ? (
                      <Image src={user.imageUrl} alt={user.name} fill style={{ objectFit: "cover" }} unoptimized />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">{user.name[0]}</div>
                    )}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-1">{user.name}</h3>
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-8">{user.role}</p>
                <div className="flex items-center gap-2 w-full mt-auto">
                  <button onClick={() => openEdit(user)} className="flex-1 bg-[#F7EFEA] hover:bg-[#F0E1D5] text-primary font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => openDeleteDialog(user._id)} className="w-10 h-10 bg-red-50 border border-red-100 hover:bg-red-100 flex items-center justify-center rounded-lg text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center rounded-lg text-neutral-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div onClick={openCreate} className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-75">
              <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 mb-6 shadow-sm">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-neutral-500 text-sm mb-2">Add New Team Member</h3>
              <p className="text-xs text-neutral-400">Invite your colleagues</p>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Member" : "Add Team Member"} maxWidth="2xl"> 
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: (e.target as HTMLInputElement).value }))} />
          <Input label="Role / Title" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: (e.target as HTMLInputElement).value }))} />
          <ImageUpload label="Photo" folder="team" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
            <textarea rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => !deleting && setDeleteId(null)}
        title="Delete Team Member"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">Are you sure you want to delete this team member?</p>
      </Modal>
    </>
  );
}
