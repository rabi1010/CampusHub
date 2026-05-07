import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string; // e.g. "+12% this month"
  positive?: boolean; // green vs red change indicator
  color?: "jade" | "ink" | "gold" | "red";
}

const COLOR_MAP = {
  jade: "bg-jade-500/10 text-jade-400 border-jade-500/20",
  ink: "bg-ink-500/20  text-ink-300  border-ink-400/20",
  gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
  red: "bg-red-500/10  text-red-400  border-red-500/20",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  change,
  positive = true,
  color = "jade",
}: StatCardProps) {
  return (
    <div
      className="glass rounded-2xl p-5 flex flex-col gap-4
                 hover:border-white/20 transition-all duration-300
                 hover:-translate-y-0.5 hover:shadow-card-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="font-display text-3xl text-ink-50">{value}</p>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
            COLOR_MAP[color],
          )}
        >
          <Icon size={18} />
        </div>
      </div>

      {change && (
        <p
          className={clsx(
            "text-xs font-mono",
            positive ? "text-jade-500" : "text-red-400",
          )}
        >
          {positive ? "↑" : "↓"} {change}
        </p>
      )}
    </div>
  );
}
