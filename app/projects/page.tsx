"use client";

import { useState } from "react";
import Image from "next/image";
import { dummyProjects } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

const filters = [
  { label: "All Projects",      icon: "mdi:view-grid-outline" },
  { label: "Architecture",      icon: "mdi:office-building-outline" },
  { label: "Civil Engineering", icon: "mdi:bridge" },
  { label: "Project Management",icon: "mdi:clipboard-list-outline" },
  { label: "Completed",         icon: "mdi:check-circle-outline" },
  { label: "Ongoing",           icon: "mdi:progress-clock" },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filteredProjects = dummyProjects.filter((project) => {
    if (activeFilter === "All Projects") return true;
    if (activeFilter === "Completed" || activeFilter === "Ongoing") {
      return project.status === activeFilter;
    }
    return project.category === activeFilter;
  });

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
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Our Portfolio
          </h1>
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
                isActive(label)
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-neutral-900 hover:brightness-95 active:brightness-90"
              )}
              style={isActive(label) ? undefined : { backgroundColor: "#F3ECE8" }}
            >
              <Icon
                icon={icon}
                width={16}
                height={16}
                style={{ color: isActive(label) ? "rgba(255,255,255,0.85)" : "#B75E1ACC" }}
              />
              {label}
            </button>
          ))}
        </div>

        {/* Grid Masonry (Using CSS columns for masonry effect or standard flex/grid) 
            For exact layout matching the design, a grid with different card heights works well. 
            We'll use standard grid with varied spans if possible, or columns layout.
        */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id} 
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div 
                className={cn(
                  "relative w-full",
                  idx % 3 === 0 ? "h-[500px]" : idx % 2 === 0 ? "h-[350px]" : "h-[450px]"
                )}
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-700"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-100" />
              
              <div className="absolute top-6 right-6">
                <Badge variant="glass" className="uppercase text-white font-medium tracking-widest text-[0.65rem] px-3 py-3">
                  {project.category}
                </Badge>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-heading text-2xl font-bold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No projects found for this category.
          </div>
        )}

      </div>
    </div>
  );
}
