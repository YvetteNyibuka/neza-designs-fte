"use client";

import { Bell, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, actions }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-24 px-8 border-b border-neutral-200 bg-neutral-50/20 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      <div>
        {title ? (
          <h1 className="font-heading text-2xl font-bold text-neutral-900">{title}</h1>
        ) : (
          <div>
            <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-1">Dashboard Overview</h1>
            <p className="text-sm text-neutral-500 font-medium">Welcome back. Here&apos;s what&apos;s happening today.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {actions && <div className="flex items-center gap-3 mr-4">{actions}</div>}

        <div className="flex items-center gap-4 text-neutral-500">
          <button className="hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
          <div className="text-right">
            <div className="text-sm font-bold text-neutral-900 leading-none capitalize">
              {user?.email?.split("@")[0] ?? "Admin"}
            </div>
            <div className="text-xs text-neutral-400 mt-1 capitalize">{user?.role ?? "admin"}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-neutral-400 hover:text-red-500 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
