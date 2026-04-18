"use client";

import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Eye, Building2, HardHat, Mail, MoreVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminDashboardPage() {
  const statCards = [
    { title: "Total Projects", value: "45", trend: "+2%", icon: Building2 },
    { title: "Active Sites", value: "12", trend: "+5%", icon: HardHat },
    { title: "Total Views", value: "12.5k", trend: "+15%", icon: Eye },
    { title: "New Inquiries", value: "8", text: "New today", icon: Mail },
  ];

  const recentProjects = [
    { id: 1, name: "Villa Kigali", type: "Residential", client: "Mugabo Estate", location: "Kigali, Rwanda", status: "Ongoing", date: "Oct 24, 2023", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80" },
    { id: 2, name: "Resort Musanze", type: "Hospitality", client: "Volcanoes Tourism", location: "Musanze, Rwanda", status: "Completed", date: "Sep 12, 2023", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=100&q=80" },
    { id: 3, name: "Office CBD", type: "Commercial", client: "Global Tech Ltd", location: "Kigali, Rwanda", status: "Ongoing", date: "Aug 05, 2023", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=80" },
    { id: 4, name: "Lake Kivu Lodge", type: "Hospitality", client: "Kivu Belt Dev", location: "Rubavu, Rwanda", status: "Pending", date: "Jul 18, 2023", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&q=80" },
  ];

  const columns: ColumnDef<any>[] = [
    { 
      key: "name", 
      header: "Project Name",
      cell: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md overflow-hidden relative shrink-0">
            <Image src={item.img} alt={item.name} fill style={{objectFit: 'cover'}} />
          </div>
          <div>
            <div className="font-bold text-neutral-900">{item.name}</div>
            <div className="text-xs text-neutral-500">{item.type}</div>
          </div>
        </div>
      )
    },
    { key: "client", header: "Client" },
    { key: "location", header: "Location" },
    { 
      key: "status", 
      header: "Status",
      cell: (item) => (
        <Badge 
          variant={item.status === 'Completed' ? 'default' : item.status === 'Ongoing' ? 'secondary' : 'outline'}
          className={item.status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-200" : item.status === 'Ongoing' ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-neutral-100 text-neutral-700"}
        >
          {item.status}
        </Badge>
      )
    },
    { key: "date", header: "Date Added" },
    { 
      key: "actions", 
      header: "Actions",
      cell: () => (
        <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors">
          <MoreVertical className="w-4 h-4 text-neutral-400" />
        </button>
      )
    },
  ];

  return (
    <>
      <AdminHeader 
        actions={
          <>
            <Button variant="outline" className="h-10 bg-white shadow-sm border-neutral-200 text-neutral-700">
              <FileText className="w-4 h-4 mr-2 text-neutral-400" /> New Post
            </Button>
            <Button className="h-10 shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </>
        }
      />
      
      <div className="p-8 space-y-6 max-w-[1400px]">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <Card key={i} className="border-neutral-200 shadow-sm">
              <CardContent className="p-6 flex items-start justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-bold text-3xl text-neutral-900">{stat.value}</span>
                    {stat.trend && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>}
                    {stat.text && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{stat.text}</span>}
                  </div>
                </div>
                <stat.icon className="w-12 h-12 text-primary/10 absolute -right-2 -top-2 transform rotate-12" strokeWidth={1.5} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Visitor Traffic</h3>
                  <p className="text-xs text-neutral-500">Monthly unique visitors overview</p>
                </div>
                <select className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              
              {/* Mock Chart */}
              <div className="h-64 mt-4 relative flex items-end justify-between gap-2 border-b border-neutral-100 pb-2">
                {[4, 6, 5, 7, 5, 9].map((val, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2 group">
                    <div 
                      className={cn("w-full transition-all duration-500 rounded-t-sm", i === 5 ? "bg-primary" : "bg-[#EDDFD6]")} 
                      style={{ height: `${val * 10}%` }} 
                    />
                    {i === 0 && <span className="text-[10px] text-neutral-400">Week 1</span>}
                    {i === 2 && <span className="text-[10px] text-neutral-400">Week 2</span>}
                    {i === 4 && <span className="text-[10px] text-neutral-400">Week 3</span>}
                    {i === 5 && <span className="text-[10px] text-neutral-400">Week 4</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-lg text-neutral-900">Top Projects</h3>
              <p className="text-xs text-neutral-500 mb-6">Most viewed portfolio items</p>
              
              <div className="space-y-6">
                {[
                  { name: "Villa Kigali", percent: 45 },
                  { name: "Resort Musanze", percent: 28 },
                  { name: "Office CBD", percent: 15 },
                  { name: "Hotel Rubavu", percent: 12 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-neutral-700">{item.name}</span>
                      <span className="font-bold text-primary text-xs">{item.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary rounded-full relative" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 border-neutral-200 text-neutral-600 text-sm h-10">
                View All Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <Card className="border-neutral-200 shadow-sm">
          <div className="p-6 flex items-center justify-between border-b border-neutral-100">
            <h3 className="font-heading font-bold text-lg text-neutral-900">Recent Projects</h3>
          </div>
          <div className="p-0">
            <Table 
              data={recentProjects}
              columns={columns}
              searchable
              searchPlaceholder="Search projects..."
              className="px-6 py-6"
            />
          </div>
          <div className="p-6 pt-0 text-xs text-neutral-400 font-medium">
            Showing {recentProjects.length} of 45 projects
          </div>
        </Card>
      </div>
    </>
  );
}
