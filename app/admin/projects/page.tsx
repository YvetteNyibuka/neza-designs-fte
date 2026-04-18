"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Edit, Leaf, MonitorSmartphone, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProjectsPage() {
  const [activeTab, setActiveTab] = useState("All Projects (42)");
  const tabs = ["All Projects (42)", "Ongoing (28)", "Completed (14)", "On Hold"];

  const projects = [
    { id: 1, name: "Metropolitan Tower", client: "Urban Build Co.", location: "New York, NY", deadline: "Oct 12, 2023", status: "ONGOING", iconBg: "bg-orange-50", iconText: "text-primary" },
    { id: 2, name: "Green Valley Bridge", client: "City Council", location: "Austin, TX", deadline: "Sep 05, 2023", status: "COMPLETED", iconBg: "bg-green-50", iconText: "text-green-600" },
    { id: 3, name: "Skyline Apartments", client: "Horizon Dev", location: "Chicago, IL", deadline: "Aug 20, 2023", status: "ONGOING", iconBg: "bg-orange-50", iconText: "text-primary" },
    { id: 4, name: "Riverside Plaza", client: "Waterfront Inc.", location: "Miami, FL", deadline: "Jul 15, 2023", status: "COMPLETED", iconBg: "bg-green-50", iconText: "text-green-600" },
    { id: 5, name: "Industrial Complex B", client: "LogiCorp", location: "Houston, TX", deadline: "Dec 01, 2023", status: "ONGOING", iconBg: "bg-orange-50", iconText: "text-primary" },
  ];

  const columns: ColumnDef<any>[] = [
    {
      key: "name",
      header: "PROJECT NAME",
      cell: (item) => (
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg", item.iconBg, item.iconText)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
          </div>
          <span className="font-bold text-neutral-900">{item.name}</span>
        </div>
      )
    },
    { key: "client", header: "CLIENT" },
    { 
      key: "location", 
      header: "LOCATION",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-neutral-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {item.location}
        </div>
      )
    },
    { key: "deadline", header: "DEADLINE" },
    {
      key: "status",
      header: "STATUS",
      cell: (item) => (
        <Badge variant={item.status === 'COMPLETED' ? 'default' : 'secondary'} className={cn("text-[10px] px-2 py-1 tracking-widest uppercase font-bold", item.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
          {item.status}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: () => (
        <button className="p-2 border border-neutral-200 rounded-md text-neutral-400 hover:text-primary hover:border-primary transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <>
      <AdminHeader title="Project Management" />
      
      <div className="p-8 max-w-[1400px]">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Find a project..." className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
          <div className="flex gap-6 text-sm font-bold border-b border-neutral-200 w-full md:w-auto">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={cn("pb-3 px-1 relative whitespace-nowrap", activeTab === tab ? "text-primary" : "text-neutral-500")}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-12">
          <Table 
            data={projects}
            columns={columns}
            className="w-full text-sm"
          />
          <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Showing <strong className="text-neutral-900">1-5</strong> of <strong className="text-neutral-900">42</strong> projects</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50">&gt;</button>
            </div>
          </div>
        </div>

        {/* Strategic Initiatives */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-6">Strategic Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F9F6F0] p-8 rounded-xl border border-[#EBE3D5] group hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-6 bg-white">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 mb-3">Sustainable Infrastructure</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">Focusing on net-zero engineering for upcoming residential projects in the tri-state area.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                VIEW ROADMAP &rarr;
              </div>
              <div className="h-1 w-0 bg-primary absolute bottom-0 left-0 group-hover:w-full transition-all duration-300 rounded-b-xl"></div>
            </div>

            <div className="bg-[#F4F4F4] p-8 rounded-xl border border-neutral-200 group hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full text-primary flex items-center justify-center mb-6 bg-white">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 mb-3">Smart City Integration</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">Implementing IoT-based traffic and power management in our downtown commercial designs.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                EXPLORE TECH &rarr;
              </div>
              <div className="h-1 w-0 bg-primary absolute bottom-0 left-0 group-hover:w-full transition-all duration-300 rounded-b-xl"></div>
            </div>

            <div className="bg-[#B75E1A] text-white p-8 rounded-xl border border-[#934509] group relative overflow-hidden shadow-lg cursor-pointer hover:-translate-y-1 transition-transform">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center mb-6 bg-white/10">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-3">Quick Report</h3>
              <p className="text-sm text-white/80 mb-8 leading-relaxed">Generate an instant status report for all ongoing high-priority projects.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                GENERATE NOW &rarr;
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
