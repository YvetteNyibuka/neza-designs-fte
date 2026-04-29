"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/Button";
import { getPublications } from "@/lib/api/publications";
import type { Publication, PublicationType } from "@/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const TYPES: Array<"All" | PublicationType> = ["All", "Report", "Portfolio", "Law", "Policy", "Guide", "Other"];

function getFileIcon(fileUrl?: string): { icon: string; color: string } {
  if (!fileUrl) return { icon: "mdi:file-outline", color: "text-neutral-400" };
  const ext = fileUrl.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { icon: "mdi:file-pdf-box", color: "text-red-500" };
  if (ext === "doc" || ext === "docx") return { icon: "mdi:file-word-box", color: "text-blue-500" };
  if (ext === "xls" || ext === "xlsx") return { icon: "mdi:file-excel-box", color: "text-green-600" };
  if (ext === "zip" || ext === "rar" || ext === "7z") return { icon: "mdi:zip-box", color: "text-yellow-500" };
  if (ext === "ppt" || ext === "pptx") return { icon: "mdi:file-powerpoint-box", color: "text-orange-500" };
  return { icon: "mdi:file-document-outline", color: "text-neutral-500" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function PublicationsPage() {
  const [activeType, setActiveType] = useState<"All" | PublicationType>("All");
  const [search, setSearch] = useState("");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublications({ limit: 200 })
      .then((res) => setPublications(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = publications;
    if (activeType !== "All") list = list.filter((p) => p.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [publications, activeType, search]);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop"
            alt="Publications background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/65 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-accent text-xs font-bold tracking-widest uppercase mb-4">Knowledge & Resources</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">Publications</h1>
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            Reports, portfolios, legal references, and strategic documents from NEEZA — free to download.
          </p>
          <Button
            size="lg"
            className="h-14 px-8 text-base"
            onClick={() => document.getElementById("publications-list")?.scrollIntoView({ behavior: "smooth" })}
          >
            Browse Publications
          </Button>
        </div>
      </section>

      {/* Document Library */}
      <section id="publications-list" className="py-14">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                    activeType === type
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search publications..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {loading && (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-neutral-500">Loading publications...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-neutral-600">
              No publications found{search ? ` for "${search}"` : ""}.
            </div>
          )}

          {/* Document table */}
          {!loading && filtered.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_140px] px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                <span>Title</span>
                <span>Info</span>
                <span className="text-right pr-1">Modified</span>
              </div>

              {filtered.map((pub, i) => {
                const { icon, color } = getFileIcon(pub.fileUrl);
                const url = pub.fileUrl ?? pub.externalUrl;
                return (
                  <div
                    key={pub._id}
                    className={cn(
                      "grid grid-cols-[1fr_80px_140px] px-5 py-4 items-center gap-x-2 transition-colors",
                      i !== filtered.length - 1 && "border-b border-neutral-100",
                      url ? "hover:bg-neutral-50 cursor-pointer group" : ""
                    )}
                    onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
                  >
                    {/* Icon + Title */}
                    <div className="flex items-start gap-3 min-w-0">
                      <Icon icon={icon} className={cn("w-9 h-9 shrink-0 mt-0.5", color)} />
                      <div className="min-w-0">
                        <p className={cn("font-medium text-sm text-neutral-900 leading-snug line-clamp-2", url && "group-hover:text-primary transition-colors")}>
                          {pub.title}
                        </p>
                        {(pub.tags ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pub.tags ?? []).slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* File size */}
                    <span className="text-sm text-neutral-500 whitespace-nowrap">
                      {pub.fileSize ?? (url ? "—" : <span className="italic text-neutral-400 text-xs">No file</span>)}
                    </span>

                    {/* Date + download icon */}
                    <div className="flex items-center justify-end gap-2 pr-1">
                      <span className="text-sm text-neutral-400 whitespace-nowrap">{formatDate(pub.publishedAt)}</span>
                      {url && (
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-neutral-300 hover:text-primary transition-colors shrink-0"
                          title={pub.fileUrl ? "Download" : "Open link"}
                        >
                          <Icon icon={pub.fileUrl ? "mdi:download" : "mdi:open-in-new"} className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
