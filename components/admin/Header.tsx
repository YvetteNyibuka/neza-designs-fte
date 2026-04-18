import { Bell, HelpCircle } from "lucide-react";
import Image from "next/image";

interface AdminHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, actions }: AdminHeaderProps) {
  return (
    <header className="h-24 px-8 border-b border-neutral-200 bg-neutral-50/20 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      <div>
        {title ? (
          <h1 className="font-heading text-2xl font-bold text-neutral-900">{title}</h1>
        ) : (
          <div>
            <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-1">Dashboard Overview</h1>
            <p className="text-sm text-neutral-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
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
            <div className="text-sm font-bold text-neutral-900 leading-none">Admin User</div>
            <div className="text-xs text-neutral-400 mt-1">Super Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden relative">
            <Image 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" 
              alt="Admin Avatar" 
              fill 
              style={{ objectFit: "cover" }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
