"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminTeamPage() {
  const [activeTab, setActiveTab] = useState("All Members");
  const tabs = ["All Members", "Designers", "Developers"];

  const team = [
    { id: 1, name: "Alex Rivera", role: "PRODUCT DESIGNER", status: "online", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&q=80" },
    { id: 2, name: "Jordan Smith", role: "SENIOR DEVELOPER", status: "online", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80" },
    { id: 3, name: "Taylor Wong", role: "UX RESEARCHER", status: "offline", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&q=80" },
    { id: 4, name: "Morgan Lee", role: "FRONTEND ENGINEER", status: "online", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&q=80" },
    { id: 5, name: "Casey Jones", role: "PROJECT MANAGER", status: "away", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
    { id: 6, name: "Riley Davis", role: "BACKEND DEVELOPER", status: "online", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
    { id: 7, name: "Jamie Smith", role: "MARKETING LEAD", status: "online", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  ];

  return (
    <>
      <AdminHeader 
        title="Team Management" 
        actions={
          <Button className="h-11 px-6 bg-[#B75E1A] hover:bg-[#934509] text-white shadow-sm font-bold">
            <Plus className="w-5 h-5 mr-2" /> Add Team Member
          </Button>
        }
      />
      
      <div className="p-8 max-w-[1400px]">
        {/* Search & Tabs */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm font-bold border-b border-neutral-100 w-full md:w-auto px-4">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={cn("pb-4 relative whitespace-nowrap pt-2", activeTab === tab ? "text-neutral-900" : "text-neutral-400 font-medium")}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B75E1A]"></div>}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search team members..." className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
              
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden relative ring-4 ring-[#F7EFEA] group-hover:ring-[#B75E1A]/20 transition-all">
                  <Image src={user.img} alt={user.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div className={cn(
                  "absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white",
                  user.status === 'online' ? "bg-green-500" : user.status === 'away' ? "bg-orange-500" : "bg-neutral-400"
                )}></div>
              </div>

              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-1">{user.name}</h3>
              <p className="text-[10px] font-bold tracking-widest text-[#B75E1A] uppercase mb-8">{user.role}</p>

              <div className="flex items-center gap-2 w-full mt-auto">
                <button className="flex-1 bg-[#F7EFEA] hover:bg-[#F0E1D5] text-[#B75E1A] font-bold text-xs py-2.5 rounded-lg transition-colors">
                  Profile
                </button>
                <button className="w-10 h-10 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center rounded-lg text-neutral-400 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {/* Add New Box */}
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px]">
             <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 mb-6 shadow-sm">
                <Plus className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-neutral-500 text-sm mb-2">Add New Team Member</h3>
             <p className="text-xs text-neutral-400">Invite your colleagues</p>
          </div>

        </div>
      </div>
    </>
  );
}
