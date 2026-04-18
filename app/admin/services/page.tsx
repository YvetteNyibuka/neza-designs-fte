"use client";

import { AdminHeader } from "@/components/admin/Header";
import { Edit, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AdminServicesPage() {
  const services = [
    {
      id: 1,
      dept: "DEPARTMENT A1",
      title: "Architecture",
      desc: "Innovative design and meticulous planning for high-end residential, commercial, and industrial structures focusing on sustainability and aesthetics.",
      sub: ["Residential Design", "Commercial Spaces", "Industrial Planning"],
      avatars: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"],
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
    },
    {
      id: 2,
      dept: "DEPARTMENT B2",
      title: "Civil Engineering",
      desc: "Specialized infrastructure development, structural health analysis, and large-scale project execution for public and private sectors.",
      sub: ["Roads & Transport", "Bridges", "Drainage Systems", "Structural Analysis"],
      avatars: ["https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"],
      img: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070"
    },
    {
      id: 3,
      dept: "DEPARTMENT C3",
      title: "Project Management",
      desc: "End-to-end management of complex construction projects, ensuring timeline compliance, budget control, and quality assurance at every stage.",
      sub: ["Construction Supervision", "Contract Administration"],
      avatars: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100", "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100"],
      img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070"
    },
    {
      id: 4,
      dept: "DEPARTMENT D4",
      title: "Land Acquisition",
      desc: "Strategic land identification, legal verification, valuation, and acquisition processes for diverse developmental projects across the region.",
      sub: ["Site Selection", "Feasibility Studies", "Legal Processing"],
      avatars: ["https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100"],
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064"
    }
  ];

  return (
    <>
      <AdminHeader title="Service Management" />
      
      <div className="p-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              
              {/* Header Image Area */}
              <div className="relative h-64 w-full group">
                <Image src={svc.img} alt={svc.title} fill style={{ objectFit: "cover" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Edit Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-md flex items-center justify-center text-white transition-colors border border-white/20">
                  <Edit className="w-5 h-5" />
                </button>

                {/* Badges & Title */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#1C1C1C]/40 backdrop-blur-md border border-white/20 text-[#B75E1A] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded inline-block mb-3 bg-[#B75E1A]">
                    <span className="text-white drop-shadow-md">{svc.dept}</span>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-white drop-shadow-md line-clamp-1">{svc.title}</h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-neutral-600 leading-relaxed mb-8 text-sm">
                  {svc.desc}
                </p>

                <div className="mb-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold tracking-widest text-[#B75E1A] uppercase flex items-center gap-2">
                       <ArrowRight className="w-3 h-3 rotate-45 text-[#B75E1A]" /> SUB-SERVICES ({svc.sub.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {svc.sub.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-[11px] font-bold text-neutral-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center">
                    {svc.avatars.map((av, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden relative ${i > 0 && '-ml-3'}`}>
                        <Image src={av} alt="Avatar" fill style={{ objectFit: "cover" }} />
                      </div>
                    ))}
                    <div className={`w-8 h-8 rounded-full border-2 border-white bg-[#F7EFEA] flex items-center justify-center text-[10px] font-bold text-[#B75E1A] -ml-3 z-10`}>
                      +{Math.floor(Math.random() * 5) + 1}
                    </div>
                  </div>
                  
                  <button className="text-sm font-bold text-[#B75E1A] flex items-center gap-2 hover:text-[#934509] transition-colors group">
                    Edit Service Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}
