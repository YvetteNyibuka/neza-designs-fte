import { Icon } from "@iconify/react";

interface AdminEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminEmptyState({ icon = "mdi:inbox-outline", title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-neutral-200 border-dashed rounded-xl">
      <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon icon={icon} className="w-7 h-7 text-neutral-400" />
      </div>
      <p className="text-sm font-semibold text-neutral-700 mb-1">{title}</p>
      {description && (
        <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
