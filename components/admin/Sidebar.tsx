"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBranding } from "@/components/layout/BrandingProvider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Wrench, 
  Users, 
  Mail,
  Briefcase,
  BookOpen,
  Settings, 
  LogOut,
  X,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: Building2 },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { name: "Careers", href: "/admin/careers", icon: Briefcase },
  { name: "Publications", href: "/admin/publications", icon: BookOpen },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { branding } = useBranding();

  const sidebarContent = (
    <aside className="w-64 bg-[#FDFCFB] border-r border-neutral-200 flex flex-col h-full">
      {/* Brand */}
      <div className="h-24 flex items-center justify-between px-4 border-b border-neutral-200">
        <Link href="/" className="flex items-center" title="Go to website">
          <Image
            src={branding.logoLight}
            alt="NEEZA"
            width={160}
            height={64}
            className="h-14 w-auto"
          />
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F7EFEA] text-primary"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-neutral-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-destructive hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 opacity-80" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden lg:flex h-screen w-64 fixed top-0 left-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile — slide-in drawer */}
      {/* Backdrop */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-neutral-900/50 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
