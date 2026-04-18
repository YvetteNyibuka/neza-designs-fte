"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Wrench, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut 
} from "lucide-react";
import Image from "next/image";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: Building2 },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Team", href: "/admin/team", icon: Users },
  // { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-50/50 border-r border-neutral-200 flex flex-col h-screen fixed top-0 left-0">
      {/* Brand */}
      <div className="h-24 flex items-center justify-center border-b border-neutral-200">
        <Link href="/admin" className="flex flex-col items-center">
          <span className="font-heading font-bold text-2xl tracking-tighter leading-none text-primary">
            NEEZA
          </span>
          <span className="text-[0.6rem] font-bold tracking-widest uppercase text-neutral-700 mt-1">
            Designs Ltd.
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F7EFEA] text-primary" // Slight orange tint from the design
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-neutral-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer / Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-destructive hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 opacity-80" />
          Logout
        </button>
      </div>
    </aside>
  );
}
