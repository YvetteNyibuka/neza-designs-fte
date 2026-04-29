"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api/posts";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateBlogForm } from "@/lib/formValidation";
import type { BlogPost } from "@/types";

const CATEGORIES = ["Sustainability", "Urbanization", "Design Trends", "Rwanda Projects", "FEATURED INSIGHTS"] as const;

const emptyForm = {
  title: "", excerpt: "", content: "", category: "Sustainability" as BlogPost["category"],
  imageUrl: "", readTime: "5", publishedAt: new Date().toISOString().slice(0, 10),
  authorName: "", authorRole: "",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit, search };
    if (activeCat !== "All") params.category = activeCat;
    const res = await getPosts(params).catch(() => null);
    if (res) {
      setPosts(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    }
    setLoading(false);
  }, [page, search, activeCat]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      readTime: String(post.readTime),
      publishedAt: new Date(post.publishedAt).toISOString().slice(0, 10),
      authorName: post.author.name,
      authorRole: post.author.role,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    const validationErrors = validateBlogForm(form);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        category: form.category,
        imageUrl: form.imageUrl,
        readTime: Number(form.readTime),
        publishedAt: new Date(form.publishedAt).toISOString(),
        author: { name: form.authorName.trim(), role: form.authorRole.trim() },
      };
      if (editing) {
        await updatePost(editing.slug, payload);
      } else {
        await createPost(payload);
      }
      setModalOpen(false);
      fetchPosts();
      toast.success(editing ? "Post updated" : "Post created");
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to save post");
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
    await deletePost(deleteSlug).then(() => {
      toast.success("Post deleted");
      setDeleteSlug(null);
    }).catch((err: unknown) => {
      toastApiErrors(err, "Failed to delete post");
    });
    await fetchPosts();
    setDeleting(false);
  }

  const columns: ColumnDef<BlogPost>[] = [
    {
      key: "title",
      header: "ARTICLE DETAILS",
      cell: (item) => (
        <div className="flex items-center gap-4 py-2">
          <div className="relative w-20 h-14 rounded-md overflow-hidden shrink-0">
            <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
          <div className="max-w-xs">
            <div className="font-bold text-neutral-900 leading-snug line-clamp-2">{item.title}</div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {item.author.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      cell: (item) => (
        <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5 tracking-widest font-bold px-2 py-1 uppercase">
          {item.category}
        </Badge>
      ),
    },
    {
      key: "publishedAt",
      header: "DATE",
      cell: (item) => (
        <div className="text-sm text-neutral-500">{new Date(item.publishedAt).toLocaleDateString()}</div>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(item)} className="p-2 text-neutral-400 hover:text-primary transition-colors bg-neutral-50 rounded-md">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => openDeleteDialog(item.slug)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-neutral-50 rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Blog Management"
        actions={
          <Button className="h-10" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        }
      />

      <div className="p-8 max-w-350">
        {/* Search & Tabs Block */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
            <div className="relative w-full max-w-lg">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by title or author…" className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((cat) => (
              <button key={cat} onClick={() => { setActiveCat(cat); setPage(1); }} className={cn("px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-colors", activeCat === cat ? "bg-[#F7EFEA] border-transparent text-primary" : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50")}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Table
            data={posts}
            columns={columns}
            className="w-full text-sm"
            loading={loading}
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(total / limit) || 1,
              totalItems: total,
              pageSize: limit,
              onPageChange: (p) => setPage(p),
            }}
          />
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Post" : "New Post"} maxWidth="2xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: (e.target as HTMLInputElement).value }))} />
          <Input label="Short Summary" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: (e.target as HTMLInputElement).value }))} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BlogPost["category"] }))}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <ImageUpload label="Cover Image" folder="posts" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <Input label="Read Time (minutes)" type="number" value={form.readTime} onChange={(e) => setForm((f) => ({ ...f, readTime: (e.target as HTMLInputElement).value }))} />
          <Input label="Published Date" type="date" value={form.publishedAt} onChange={(e) => setForm((f) => ({ ...f, publishedAt: (e.target as HTMLInputElement).value }))} />
          <Input label="Author Name" value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: (e.target as HTMLInputElement).value }))} />
          <Input label="Author Role" value={form.authorRole} onChange={(e) => setForm((f) => ({ ...f, authorRole: (e.target as HTMLInputElement).value }))} />
          <RichTextEditor
            label="Content"
            value={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            placeholder="Write your blog post content here…"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteSlug)}
        onClose={() => !deleting && setDeleteSlug(null)}
        title="Delete Post"
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
        <p className="text-sm text-neutral-600">Are you sure you want to delete this post?</p>
      </Modal>
    </>
  );
}
