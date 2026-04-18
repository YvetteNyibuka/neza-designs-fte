"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Filter, Search, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminBlogPage() {
  const [activeTab, setActiveTab] = useState("All Posts");
  const tabs = ["All Posts", "Published", "Drafts", "Scheduled"];
  const categories = ["Sustainability", "Urbanization", "Architecture", "Technology", "Case Studies"];

  const posts = [
    { id: 1, title: "The Future of Timber in High-Rise Urbanism", author: "Julian Thorne", category: "SUSTAINABILITY", status: "Published", date: "Oct 12, 2023", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=200&q=80" },
    { id: 2, title: "Redesigning the 15-Minute City Post-2024", author: "Elena Rodriguez", category: "URBANIZATION", status: "Draft", date: "Oct 10, 2023", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80" },
    { id: 3, title: "Brutalism Reborn: Concrete and Carbon", author: "Marcus Vane", category: "ARCHITECTURE", status: "Published", date: "Oct 05, 2023", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=200&q=80" },
    { id: 4, title: "Solar Skin: The Next Facade Revolution", author: "Julian Thorne", category: "TECHNOLOGY", status: "Scheduled", date: "Oct 20, 2023", img: "https://images.unsplash.com/photo-1481253127861-534498168948?w=200&q=80" },
  ];

  const columns: ColumnDef<any>[] = [
    {
      key: "article",
      header: "ARTICLE DETAILS",
      cell: (item) => (
        <div className="flex items-center gap-4 py-2">
          <div className="relative w-20 h-14 rounded-md overflow-hidden shrink-0">
            <Image src={item.img} alt={item.title} fill style={{objectFit: 'cover'}} />
          </div>
          <div className="max-w-xs">
            <div className="font-bold text-neutral-900 leading-snug line-clamp-2">{item.title}</div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {item.author}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "category", 
      header: "CATEGORY",
      cell: (item) => (
        <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5 tracking-widest font-bold px-2 py-1 uppercase">
          {item.category}
        </Badge>
      )
    },
    { 
      key: "status", 
      header: "STATUS",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            item.status === 'Published' ? "bg-green-500" : item.status === 'Draft' ? "bg-orange-500" : "bg-neutral-300"
          )}></div>
          <span className="text-sm font-medium text-neutral-700">{item.status}</span>
        </div>
      )
    },
    { 
      key: "date", 
      header: "DATE",
      cell: (item) => (
        <div className="text-sm text-neutral-500">{item.date}</div>
      )
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-neutral-400 hover:text-primary transition-colors bg-neutral-50 rounded-md">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-neutral-50 rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <AdminHeader title="Blog Management" />
      
      <div className="p-8 max-w-[1400px]">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="bg-white border-neutral-200 text-neutral-700 h-11 px-6 shadow-sm">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button className="h-11 px-6 bg-[#B75E1A] hover:bg-[#934509] text-white shadow-sm border border-[#934509]">
              <Edit2 className="w-4 h-4 mr-2" /> Create Post
            </Button>
          </div>
          <Button className="h-11 px-6 bg-[#B75E1A] hover:bg-[#934509] text-white shadow-sm w-full md:w-auto block md:hidden lg:flex">
             <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        {/* Search & Tabs Block */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
            <div className="relative w-full max-w-lg">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search by title, author or keyword..." className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            
            <div className="flex gap-6 text-sm font-bold border-b border-neutral-100 overflow-x-auto w-full lg:w-auto overflow-y-hidden">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  className={cn("pb-3 px-1 relative whitespace-nowrap pt-3", activeTab === tab ? "text-primary" : "text-neutral-500")}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button 
                key={cat} 
                className={cn(
                  "px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-colors", 
                  i === 0 ? "bg-[#F7EFEA] border-transparent text-primary" : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-12">
          <Table 
            data={posts}
            columns={columns}
            className="w-full text-sm"
          />
          <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Showing 1 to 4 of 24 results</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary text-white font-bold rounded-md">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:bg-neutral-50 rounded-md text-neutral-600 font-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:bg-neutral-50 rounded-md text-neutral-600 font-bold">3</button>
              <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-md text-neutral-400 hover:bg-neutral-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
