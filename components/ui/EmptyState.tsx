import { Icon } from "@iconify/react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon = "mdi:inbox-outline", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6">
        <Icon icon={icon} className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
