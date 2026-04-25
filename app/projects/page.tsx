"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getProjects } from "@/lib/api/projects";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import type { Project } from "@/types";

const filters = [
  { label: "All Projects",      icon: "mdi:view-grid-outline" },
  { label: "Architecture",      icon: "mdi:office-building-outline" },
  { label: "Civil Engineering", icon: "mdi:bridge" },
  { label: "Project Management",icon: "mdi:clipboard-list-outline" },
  { label: "Masterplanning",    icon: "mdi:map-outline" },
  { label: "Interior",          icon: "mdi:sofa-outline" },
  { label: "Completed",         icon: "mdi:check-circle-outline" },
  { label: "Ongoing",           icon: "mdi:progress-clock" },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeFilter !== "All Projects") {
      if (activeFilter === "Completed" || activeFilter === "Ongoing") {
        params.status = activeFilter;
      } else {
        params.category = activeFilter;
      }
    }
    setLoading(true);
    getProjects({ ...params, limit: 50 }).then((res) => {
      setProjects(res.data?.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activeFilter]);

  const isActive = (label: string) => activeFilter === label;

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
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                isActive(label) ? "bg-primary text-white shadow-md shadow-primary/25" : "text-neutral-900 hover:brightness-95 active:brightness-90"
              )}
              style={isActive(label) ? undefined : { backgroundColor: "#F3ECE8" }}
            >
              <Icon icon={icon} width={16} height={16} style={{ color: isActive(label) ? "rgba(255,255,255,0.85)" : "#B75E1ACC" }} />
              {label}
            </button>
          ))}
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

