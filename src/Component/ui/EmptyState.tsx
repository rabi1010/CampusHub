import { type LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center
                    py-16 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl bg-white/5
                   border border-white/[0.08]
                   flex items-center justify-center mb-4"
      >
        <Icon size={24} className="text-ink-500" />
      </div>
      <h3 className="font-medium text-ink-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-500 max-w-xs mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
