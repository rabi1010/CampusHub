import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string; // e.g. "+12% this month"
  positive?: boolean; // emerald vs rose change indicator
  color?: "brand" | "zinc" | "emerald" | "amber" | "rose" | "indigo";
}

const COLOR_MAP = {
  brand: "bg-brand-50 text-brand-600 border-brand-100",
  zinc: "bg-zinc-50 text-zinc-500 border-zinc-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  change,
  positive = true,
  color = "brand",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5 border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.15em] mb-1.5">
            {label}
          </p>
          <p className="font-display text-3xl font-medium text-zinc-900 tracking-tight">{value}</p>
        </div>

        <div
          className={clsx(
            "w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm",
            COLOR_MAP[color],
          )}
        >
          <Icon size={20} />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-2">
          <div className={clsx(
            "px-1.5 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1",
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {positive ? "↑" : "↓"} {change.split(' ')[0]}
          </div>
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
            {change.split(' ').slice(1).join(' ')}
          </span>
        </div>
      )}
    </div>
  );
}
