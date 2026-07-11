"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { getProjects } from "@/lib/api/projects";
import { getCategories } from "@/lib/api/categories";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import type { Project, ProjectStatus } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { getImageUrl } from "@/lib/imageUrl";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { MapPin, CalendarDays } from "lucide-react";

const statusStyles: Record<ProjectStatus, string> = {
  Completed: "bg-green-100 text-green-700",
  Ongoing: "bg-blue-100 text-blue-700",
  "Handed Over": "bg-purple-100 text-purple-700",
  Consulted: "bg-amber-100 text-amber-700",
};

const statusFilters = [
  { label: "All Statuses" },
  { label: "Ongoing" },
  { label: "Completed" },
  { label: "Handed Over" },
  { label: "Consulted" },
];

interface ProjectWithAspectRatio extends Project {
  aspectRatio?: number;
}

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [projects, setProjects] = useState<ProjectWithAspectRatio[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    getCategories("projects")
      .then((res) => setCategories(res.data.data.map((item) => item.name)))
      .catch(() => {});
  }, []);

  const categoryFilters = ["All Categories", ...Array.from(new Set([...categories, ...projects.map((project) => project.category).filter(Boolean), activeCategory !== "All Categories" ? activeCategory : ""]))].filter(Boolean);

  // Common project image dimensions and their aspect ratios
  const getAspectRatio = (url: string): number => {
    // Standard aspect ratios for common project image dimensions
    const ratios: Record<string, number> = {
      "3840x2150": 3840 / 2150, // ~1.78
      "7680x4320": 7680 / 4320, // ~1.78
      "4000x2250": 4000 / 2250, // ~1.78
      "1920x1080": 1920 / 1080, // ~1.78
      "2560x1440": 2560 / 1440, // ~1.78
    };

    // Try to detect from URL if it contains dimensions
    for (const [dims, ratio] of Object.entries(ratios)) {
      if (url.includes(dims)) return ratio;
    }

    // Default to 16:9 aspect ratio (1.78)
    return 16 / 9;
  };

  const handleImageLoad = (projectId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatios((prev) => ({
        ...prev,
        [projectId]: ratio,
      }));
    }
  };

  // Read searchParams on client only to avoid hydration mismatch
  useEffect(() => {
    const incomingCategory = searchParams.get("category");
    const incomingStatus = searchParams.get("status");
    if (incomingCategory) {
      setActiveCategory(incomingCategory);
    }
    if (incomingStatus && statusFilters.some((s) => s.label === incomingStatus)) {
      setActiveStatus(incomingStatus);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/projectHero.jpeg"
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
              {categoryFilters.map((label) => (
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
          <EmptyState
            icon="mdi:office-building-outline"
            title="No projects found"
            description="We couldn't find any projects matching your filters. Try adjusting the category or status above."
            action={{ label: "Clear Filters", onClick: () => { setActiveCategory("All Categories"); setActiveStatus("All Statuses"); } }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const aspectRatio = imageAspectRatios[project._id] || getAspectRatio(project.imageUrl);

              return (
                <div
                  key={project._id}
                  className="group bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${aspectRatio}` }}>
                    <FallbackImage
                      src={getImageUrl(project.imageUrl)}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-700"
                      onLoad={(e) => handleImageLoad(project._id, e)}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-transparent" />
                    <Badge
                      variant="secondary"
                      className={cn(
                        "absolute top-4 right-4 text-[10px] px-2.5 py-1 tracking-widest uppercase font-bold",
                        statusStyles[project.status]
                      )}
                    >
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" className="absolute top-4 left-4 text-[10px] px-2.5 py-1 tracking-widest uppercase font-bold text-primary bg-white/90">
                      {project.category}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 text-sm text-neutral-500">
                      {project.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                      )}
                      {project.completionYear && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{project.completionYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center py-24 text-sm text-neutral-400">Loading projects…</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

