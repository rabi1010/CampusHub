import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  success: "bg-jade-500/15 text-jade-400 border-jade-500/25",
  warning: "bg-gold-500/15 text-gold-400 border-gold-500/25",
  danger: "bg-red-500/15  text-red-400  border-red-500/25",
  info: "bg-ink-400/15  text-ink-300  border-ink-400/25",
  default: "bg-white/5    text-ink-400  border-white/10",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-xs font-mono font-medium border",
        VARIANTS[variant],
      )}
    >
      {label}
    </span>
  );
}
