"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, ColumnDef } from "@/components/ui/Table";
import { Plus, Eye, Building2, HardHat, Mail, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAnalyticsOverview, type AnalyticsOverview } from "@/lib/api/analytics";

type RecentInquiry = AnalyticsOverview["recentInquiries"][number];

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    getAnalyticsOverview().then((res) => {
      setAnalytics(res.data ?? null);
    }).catch(() => {});
  }, []);

  const statCards: { title: string; value: string; trend?: string | null; text?: string | null; icon: React.ElementType }[] = [
    { title: "Total Projects", value: String(analytics?.totals.projects ?? 0), trend: null, icon: Building2 },
    { title: "Active Sites", value: String(analytics?.totals.ongoingProjects ?? 0), trend: null, icon: HardHat },
    { title: "Published Posts", value: String(analytics?.totals.posts ?? 0), trend: null, icon: Eye },
    { title: "New Inquiries", value: String(analytics?.totals.inquiries ?? 0), text: `${analytics?.totals.unreadInquiries ?? 0} unread`, icon: Mail },
  ];

  const inquiryColumns: ColumnDef<RecentInquiry>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => <span className="font-semibold text-neutral-900">{item.name}</span>,
    },
    { key: "email", header: "Email" },
    { key: "subject", header: "Subject" },
    {
      key: "status",
      header: "Status",
      cell: () => (
        <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-full">
          New
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      cell: (item) => new Date(item.createdAt).toLocaleString(),
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

      <div className="p-8 space-y-6 max-w-350">
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
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Inquiry Traffic</h3>
                  <p className="text-xs text-neutral-500">Monthly inquiries over the last 6 months</p>
                </div>
                <select className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-64 mt-4 relative flex items-end justify-between gap-2 border-b border-neutral-100 pb-2">
                {(analytics?.monthlyInquiries ?? []).map((item, i, arr) => {
                  const max = Math.max(...arr.map((v) => v.count), 1);
                  const val = Math.max(8, Math.round((item.count / max) * 100));
                  return (
                  <div key={i} className="w-full flex flex-col items-center gap-2 group">
                    <div
                      className={cn("w-full transition-all duration-500 rounded-t-sm", i === 5 ? "bg-primary" : "bg-[#EDDFD6]")}
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] text-neutral-400">{item.month}</span>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-lg text-neutral-900">Top Projects</h3>
              <p className="text-xs text-neutral-500 mb-6">Project categories by volume</p>
              <div className="space-y-6">
                {(analytics?.topCategories ?? []).map((item, i) => {
                  const max = Math.max(...(analytics?.topCategories ?? []).map((v) => v.count), 1);
                  const pct = Math.round((item.count / max) * 100);
                  return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-neutral-700 truncate max-w-40">{item.category}</span>
                      <span className="font-bold text-primary text-xs">{pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  );
                })}
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
            <h3 className="font-heading font-bold text-lg text-neutral-900">Recent Inquiries</h3>
            <Link href="/admin/inquiries">
              <Button size="sm" variant="outline">Manage Inquiries</Button>
            </Link>
          </div>
          <div className="p-0">
            <Table
              data={analytics?.recentInquiries ?? []}
              columns={inquiryColumns}
              searchable
              searchPlaceholder="Search inquiries..."
              className="px-6 py-6"
            />
          </div>
          <div className="p-6 pt-0 text-xs text-neutral-400 font-medium">
            Showing {analytics?.recentInquiries?.length ?? 0} recent inquiries
          </div>
        </Card>
      </div>
    </>
  );
}

