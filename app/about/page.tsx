"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTeam } from "@/lib/api/team";
import { Card, CardContent } from "@/components/ui/Card";
import { Compass, Network, Leaf, Users } from "lucide-react";
import type { TeamMember } from "@/types";

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeam().then((res) => setTeam(res.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full bg-white">
      {/* 
        Hero Header 
      */}
      <section className="relative w-full h-screen flex items-center justify-center">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="NEEZA Office"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-5xl text-center">
          <h4 className="text-[#DAA119] font-bold text-xs tracking-widest uppercase mb-4">About Neeza</h4>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Crafting the Future of African Architecture
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light mb-10 max-w-3xl mx-auto">
            Founded in the heart of Kigali, NEEZA began with a singular vision: to bridge the gap between structural pragmatism and aesthetic luxury. We are more than consultants; we are custodians of a new architectural language that speaks to the modern African experience while honoring our deep-rooted heritage.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/20 mt-8 max-w-2xl mx-auto">
            <div>
              <div className="font-heading text-3xl font-bold text-white mb-1">15+</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Years Experience</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-white mb-1">40+</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Major Landmarks</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Vision & Mission 
      */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 bg-neutral-50 rounded-2xl border border-neutral-100">
              <Compass className="w-8 h-8 text-primary mb-6" />
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-4">Our Vision</h3>
              <p className="text-neutral-600 leading-relaxed">
                To be the vanguard of African architectural innovation, creating sustainable, luxurious environments that stand the test of time and redefine the skyline of the continent.
              </p>
            </div>
            <div className="p-10 bg-neutral-50 rounded-2xl border border-neutral-100">
              <Network className="w-8 h-8 text-primary mb-6" />
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-4">Our Mission</h3>
              <p className="text-neutral-600 leading-relaxed">
                Delivering integrated, world-class consultancy services that transform client aspirations into tangible landmarks through rigorous engineering precision and creative excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Core Values
      */}
      <section className="py-24 bg-neutral-50 text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Core Values</h2>
          <p className="text-neutral-500 mb-16">The principles that guide every line we draw and every foundation we lay.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: "Design Excellence", icon: Compass, text: "Uncompromising aesthetic standards that merge beauty with function." },
              { title: "Integrated Approach", icon: Network, text: "Seamless collaboration between architects and engineers for holistic solutions." },
              { title: "Sustainability", icon: Leaf, text: "Eco-conscious building practices that respect our environment." },
              { title: "Cultural Resonance", icon: Users, text: "Designs that honor and reflect our rich Rwandan heritage." },
            ].map((value, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <value.icon className="w-6 h-6 text-primary mb-6" />
                  <h3 className="font-heading text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{value.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 
        The NEEZA Model (Dark Section)
      */}
      <section className="py-24 bg-[#231F1C] text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">The NEEZA Model</h2>
              <p className="text-neutral-400 leading-relaxed mb-8">
                Our methodology is built on four strategic cornerstones that ensure every project is delivered with precision, creativity, and longevity. We don't just build, we orchestrate spaces.
              </p>
              <button className="text-primary font-medium hover:text-white transition-colors inline-flex items-center gap-2 uppercase tracking-wider text-xs">
                Learn about our process &rarr;
              </button>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { step: "01", title: "Consultation", desc: "Deep dive into client needs and site analysis to form a solid strategic brief." },
                { step: "02", title: "Conceptualization", desc: "Developing initial sketches and 3D models. Catching the vision early." },
                { step: "03", title: "Engineering", desc: "Rigorous structural detail and systems integration for safety and efficiency." },
                { step: "04", title: "Realization", desc: "Project management and construction supervision to ensure fidelity to design." },
              ].map((item) => (
                <div key={item.step} className="p-8 border border-neutral-700/50 bg-neutral-800/20 rounded-xl relative overflow-hidden group hover:bg-neutral-800/40 transition-colors">
                  <div className="text-5xl font-heading font-black text-white/5 absolute top-4 right-4">{item.step}</div>
                  <h4 className="font-heading text-xl font-bold text-white mb-3 relative z-10">{item.title}</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        Leadership 
      */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Leadership</h2>
              <p className="text-neutral-500">The minds behind the masterpieces.</p>
            </div>
            <button className="text-primary hover:text-primary-dark transition-colors font-medium text-sm">
              View Full Team &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member._id} className="group cursor-pointer">
                <div className="relative h-100 w-full rounded-2xl overflow-hidden mb-6 bg-neutral-100">
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name} 
                    fill 
                    style={{ objectFit: "cover" }} 
                    className="group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-900">{member.name}</h3>
                <p className="text-primary text-xs font-bold tracking-widest uppercase my-2">{member.role}</p>
                <p className="text-sm text-neutral-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        Headquarters / Map
      */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
            <div className="p-12 flex flex-col justify-center">
              <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-8">Our Headquarters</h2>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Address</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">Trinity Plaza | Second floor,<br />KG 19 Ave, Kibagabaga, RWANDA</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Phone</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">+250 788 548 567</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Email</h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">info.neeza@gmail.com</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="h-100 lg:h-auto min-h-100 w-full relative bg-neutral-200">
              {/* Using a static map image for demonstration based on the plan. In a real app, an iframe embed of Google Maps/OSM goes here. */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.021074474775!2d30.126435!3d-1.951034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zKcKwNTcnMDMuNyJTIDMwwrAwNyc1OC45IkU!5e0!3m2!1sen!2srw!4v1636203930811!5m2!1sen!2srw" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
