"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getProjects } from "@/lib/api/projects";
import { MoveRight, ShieldCheck, Zap, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects({ limit: 6 }).then((res) => {
      setFeaturedProjects(res.data?.data ?? []);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full relative">
      {/* 
        Hero Section 
      */}
      <section className="relative w-full h-screen flex items-center justify-center">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern glass building"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl flex flex-col items-center text-center mt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DAA119]/20 bg-[#DAA119]/30 px-3 py-1 text-xs font-semibold text-[#DAA119] tracking-widest uppercase mb-6 backdrop-blur-sm">
            East Africa's Premier Consultancy
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl tracking-tight leading-tight">
            Designing Sustainable Communities <span className="text-[#DAA119]"> &amp; </span>  Cities of the Future
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-200 max-w-2xl font-light">
            Experience ultra-modern luxury and sustainable engineering with East Africa's premier consultancy firm.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl">
              Start a Project
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base text-white border-white hover:bg-white hover:text-neutral-900 backdrop-blur-sm">
              View Portfolio <MoveRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 
        Vision & Stats Section
      */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h4 className="text-primary font-bold text-xs tracking-widest uppercase mb-4">Our Ethos</h4>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                Vision rooted in <span className="text-primary italic">heritage</span>, designed for the future.
              </h2>
            </div>
            <div>
              <p className="text-neutral-600 leading-relaxed text-lg mb-8">
                We believe in building the future of Africa through innovation, sustainability, and unparalleled excellence in design. Our approach blends traditional wisdom with cutting-edge engineering.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-neutral-50 border border-transparent group hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-10 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-200">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-neutral-900 transition-colors duration-200">Sustainable Innovation</h3>
                <p className="text-neutral-500 text-sm leading-relaxed transition-colors duration-200">Pioneering eco-friendly designs that minimize carbon footprint while maximizing comfort and aesthetic value.</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-50 border border-transparent group hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-10 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-neutral-900 transition-colors duration-200">Cultural Integrity</h3>
                <p className="text-neutral-500 text-sm leading-relaxed transition-colors duration-200">Seamlessly blending modern luxury developments with deep-rooted African heritage and community values.</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-50 border border-transparent group hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-10 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-200">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-neutral-900 transition-colors duration-200">Engineering Excellence</h3>
                <p className="text-neutral-500 text-sm leading-relaxed transition-colors duration-200">Delivering precision, safety, and uncompromising quality in every structural detail and material choice.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 
        Expertise (Services)
      */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h4 className="text-primary font-bold text-xs tracking-widest uppercase mb-4">Our Expertise</h4>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">
                Comprehensive Solutions
              </h2>
            </div>
            <Link href="/services" className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center gap-2 mt-4 md:mt-0">
              View all services <span className="text-xl leading-none">+</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Architecture",
                label: "ARCHITECTURE",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                desc: ["Concept Design, Master Planning and Interior Architecture"],
                img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
              },
              {
                title: "Civil Engineering",
                label: "CIVIL ENGINEERING",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                desc: ["Structural Integrity, Infrastructure Systems and Environmental Engineering"],
                img: "https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=2070&auto=format&fit=crop",
              },
              {
                title: "Project Management",
                label: "PROJECT MANAGEMENT",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
                desc: ["End-to-End Insight, Cost Control and Timely Delivery"],
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
              },
              {
                title: "Land Acquisition",
                label: "LAND ACQUISITION",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                desc: ["Site Feasibility, Due Diligence and Procurement Strategy"],
                img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop",
              },
            ].map((service, i) => (
              <Link href="/services" key={i} className="group relative h-96 rounded-2xl overflow-hidden block">
                {/* Image with zoom on hover */}
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-100 group-hover:scale-110"
                />
                {/* Base gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/30 to-neutral-900/20 group-hover:from-neutral-900/95 group-hover:via-neutral-900/60 group-hover:to-neutral-900/40 transition-all duration-300" />

                {/* Default state: icon + title at bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 transition-all duration-300 z-10">
                  {/* Icon */}
                  <div className="text-white mb-4 group-hover:text-[#DAA119] transition-all duration-300 shrink-0">
                    {service.icon}
                  </div>

                  {/* Title — always visible */}
                  <h3 className="text-white font-heading text-sm font-bold tracking-widest uppercase transition-all duration-300">
                    {service.label}
                  </h3>

                  {/* Description — hidden by default, slides in on hover */}
                  <p className="mt-4 text-white/60 text-xs font-medium tracking-wide text-left max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 overflow-hidden transition-all duration-300">
                    {service.desc.join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        Featured Projects
      */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">
              Featured Projects
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-500 hover:bg-primary hover:border-none hover:text-white transition-all duration-200">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-500 hover:bg-primary hover:border-none hover:text-white transition-all duration-200">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {featuredProjects.map((project) => (
              <div key={project._id} className="group relative rounded-2xl overflow-hidden h-80 min-w-[320px] md:min-w-112.5 shrink-0 snap-start">
                <Image src={project.imageUrl} alt={project.title} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-100" />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-[#DAA119] text-xs font-bold tracking-widest uppercase mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-white font-heading text-2xl font-bold mb-4">{project.title}</h3>
                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <Link href={`/projects`} className="text-white text-sm font-medium transition-colors inline-block border-b border-[#DAA119] pb-1">
                    View Case Study
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-24 bg-primary px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build the Extraordinary?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Whether it's a commercial landmark or a private sanctuary, let's bring your vision to life with precision and elegance.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 h-14 px-8 text-base">
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
