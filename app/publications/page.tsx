"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getPublications } from "@/lib/api/publications";
import type { Publication, PublicationType } from "@/types";
import { cn } from "@/lib/utils";

const TYPES: Array<"All" | PublicationType> = ["All", "Report", "Portfolio", "Law", "Policy", "Guide", "Other"];

export default function PublicationsPage() {
  const [activeType, setActiveType] = useState<"All" | PublicationType>("All");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = activeType === "All" ? { limit: 100 } : { limit: 100, type: activeType };
    getPublications(params)
      .then((res) => setPublications(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50">
      <section className="pt-40 pb-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-neutral-900 mb-4">Publications</h1>
          <p className="text-neutral-600 text-lg max-w-3xl">
            Reports, portfolios, legal references, and strategic documents from NEEZA.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-wrap gap-3 mb-8">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setLoading(true);
                  setActiveType(type);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                  activeType === type ? "bg-primary border-primary text-white" : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? <p className="text-neutral-500">Loading publications...</p> : null}
          {!loading && publications.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-neutral-600">No publications found.</div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((item) => (
              <article key={item._id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
                <div className="relative h-52 bg-neutral-100">
                  {item.coverImage ? (
                    <Image src={item.coverImage} alt={item.title} fill style={{ objectFit: "cover" }} />
                  ) : null}
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="text-xs uppercase tracking-widest font-bold text-primary">{item.type}</div>
                  <h3 className="font-heading text-xl font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.summary}</p>
                  <p className="text-xs text-neutral-400">{new Date(item.publishedAt).toLocaleDateString()}</p>
                  <div className="flex gap-2 pt-2">
                    {item.fileUrl ? (
                      <Link href={item.fileUrl} target="_blank">
                        <Button size="sm">Download</Button>
                      </Link>
                    ) : null}
                    {item.externalUrl ? (
                      <Link href={item.externalUrl} target="_blank">
                        <Button size="sm" variant="outline">Open Link</Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
