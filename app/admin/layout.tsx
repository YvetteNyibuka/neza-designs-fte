"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Icon } from "@iconify/react";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Icon icon="mdi:loading" className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Login page renders without the sidebar shell
  if (pathname === "/admin/login") return <>{children}</>;

  // Not authenticated yet (redirect pending)
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:ml-64 overflow-y-auto min-w-0">
        {/* Pass toggle to children via a data attribute read by AdminHeader */}
        <div data-sidebar-toggle="true" onClick={() => setSidebarOpen(true)} className="hidden" />
        {/* Hamburger bar — mobile only, sits above page content */}
          <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-14 bg-[#FDFCFB] border-b border-neutral-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Icon icon="mdi:menu" className="w-6 h-6" />
            </button>
            <span className="font-heading font-semibold text-neutral-900 text-base">NEEZA Admin</span>
          </div>
          {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
