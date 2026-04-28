"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { getServices } from "@/lib/api/services";
import type { Service } from "@/types";

function serviceToProjectCategory(serviceTitle: string): string {
  const lower = serviceTitle.toLowerCase();
  if (lower.includes("architecture")) return "Architecture";
  if (lower.includes("civil")) return "Civil Engineering";
  if (lower.includes("project management")) return "Project Management";
  if (lower.includes("masterplanning") || lower.includes("urban")) return "Masterplanning";
  if (lower.includes("interior")) return "Interior";
  return "Architecture";
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((res) => {
      setServices(res.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const defaultIcon = "mdi:check-circle-outline";

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50 pb-0">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1481253127861-534498168948?q=80&w=1973&auto=format&fit=crop"
            alt="Services background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Integrated Expertise for Tomorrow&apos;s Cities
          </h1>
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            A premium suite of services working seamlessly together to achieve exceptional built environments.
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-8 text-base">
              Consult With Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Services List */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-24 space-y-32">
        {loading ? (
          <div className="text-center text-neutral-400 py-16 text-sm">Loading services…</div>
        ) : services.map((svc, idx) => (
          <section key={svc._id} id={svc._id} className="scroll-mt-32">
            <div className={`flex flex-col md:flex-row gap-16 lg:gap-24 items-center ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
              <div className="flex-1 w-full">
                <div className="text-primary text-xs font-bold tracking-widest uppercase mb-6">
                  Service {String(idx + 1).padStart(2, "0")}
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">{svc.title}</h2>
                <p className="text-neutral-600 text-lg leading-relaxed mb-8">{svc.shortDescription}</p>
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  {svc.features?.map((feature, fIdx) => {
                    const name = typeof feature === "string" ? feature : (feature as { name: string }).name;
                    const meaning = typeof feature === "string" ? "" : ((feature as { meaning?: string }).meaning ?? "");
                    const icon = typeof feature === "string" ? defaultIcon : ((feature as { icon?: string }).icon ?? defaultIcon);
                    return (
                      <div key={fIdx} className="flex items-start gap-3">
                        <Icon icon={icon} width={20} height={20} className="text-primary opacity-80 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-neutral-700 font-medium leading-snug">{name}</div>
                          {meaning && <div className="text-xs text-neutral-400 mt-0.5 leading-snug">{meaning}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-12">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/contact?service=${encodeURIComponent(svc.title)}`}>
                      <Button className="rounded-md">
                        {svc.buttonTitle ?? "Request This Service"}
                      </Button>
                    </Link>
                    <Link href={`/projects?category=${encodeURIComponent(serviceToProjectCategory(svc.title))}`}>
                      <Button variant="outline" className="border-black text-black rounded-md bg-white hover:bg-black hover:text-white transition-colors duration-100">
                        View Related Projects
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="relative h-100 md:h-125 w-full rounded-3xl overflow-hidden shadow-xl border border-neutral-100">
                  {svc.imageUrl && (
                    <Image src={svc.imageUrl} alt={svc.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} unoptimized />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build the Future?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
            Whether you are planning a commercial development or a bespoke residential masterpiece, NEEZA brings your vision to life.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-neutral-100">Start a Project</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
