"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getProjects } from "@/lib/api/projects";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import type { Project } from "@/types";

const categoryFilters = [
  { label: "All Categories" },
  { label: "Architecture" },
  { label: "Civil Engineering" },
  { label: "Project Management" },
  { label: "Masterplanning" },
  { label: "Interior" },
];

const statusFilters = [
  { label: "All Statuses" },
  { label: "Ongoing" },
  { label: "Completed" },
  { label: "Handed Over" },
  { label: "Consulted" },
];

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const incomingCategory = searchParams.get("category");
    return incomingCategory && categoryFilters.some((c) => c.label === incomingCategory)
      ? incomingCategory
      : "All Categories";
  });
  const [activeStatus, setActiveStatus] = useState(() => {
    const incomingStatus = searchParams.get("status");
    return incomingStatus && statusFilters.some((s) => s.label === incomingStatus)
      ? incomingStatus
      : "All Statuses";
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategory !== "All Categories") params.category = activeCategory;
    if (activeStatus !== "All Statuses") params.status = activeStatus;

    getProjects({ ...params, limit: 50 }).then((res) => {
      setProjects(res.data?.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activeCategory, activeStatus]);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Projects Hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">Our Portfolio</h1>
          <p className="text-lg text-white font-light max-w-2xl mx-auto leading-relaxed">
            Discover our collection of sustainable luxury architecture and engineering masterpieces across East Africa.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-24">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="flex-1">
            <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">Category</label>
            <select
              value={activeCategory}
              onChange={(e) => { setLoading(true); setActiveCategory(e.target.value); }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {categoryFilters.map(({ label }) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">Status</label>
            <select
              value={activeStatus}
              onChange={(e) => { setLoading(true); setActiveStatus(e.target.value); }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {statusFilters.map(({ label }) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-neutral-400 py-24 text-sm">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-neutral-400 py-24 text-sm">No projects found.</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project, idx) => (
              <div key={project._id} className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer">
                <div className={cn("relative w-full", idx % 3 === 0 ? "h-125" : idx % 2 === 0 ? "h-87.5" : "h-112.5")}>
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge variant="secondary" className="text-[10px] text-primary tracking-widest uppercase mb-3 bg-white/90">{project.category}</Badge>
                    <h3 className="font-heading font-bold text-xl text-white">{project.title}</h3>
                    {project.location && <p className="text-white/70 text-sm mt-1">{project.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

