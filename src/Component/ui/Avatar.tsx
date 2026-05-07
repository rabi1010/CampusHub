import clsx from "clsx";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: "jade" | "ink" | "gold";
}

const SIZES = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

const COLORS = {
  jade: "bg-jade-500/20 border-jade-500/30 text-jade-300",
  ink: "bg-ink-500/30  border-ink-400/30  text-ink-200",
  gold: "bg-gold-500/15 border-gold-500/25 text-gold-300",
};

// Pick a consistent color based on the name
function getColor(name: string): "jade" | "ink" | "gold" {
  const i = name.charCodeAt(0) % 3;
  return (["jade", "ink", "gold"] as const)[i];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, size = "md", color }: AvatarProps) {
  const c = color ?? getColor(name);
  return (
    <div
      className={clsx(
        "rounded-lg border flex items-center justify-center",
        "font-semibold shrink-0",
        SIZES[size],
        COLORS[c],
      )}
    >
      {getInitials(name)}
    </div>
  );
}
