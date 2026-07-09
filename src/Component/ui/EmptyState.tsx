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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-zinc-400" />
      </div>
      <h3 className="font-medium text-zinc-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
