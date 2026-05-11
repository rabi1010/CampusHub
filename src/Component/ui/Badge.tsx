import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  danger: "bg-rose-50  text-rose-600  border-rose-100",
  info: "bg-brand-50  text-brand-600  border-brand-100",
  default: "bg-slate-50  text-slate-500  border-slate-100",
};

export default function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-lg",
        "text-[10px] font-bold uppercase tracking-wider border",
        VARIANTS[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
