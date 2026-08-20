import clsx from "clsx";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "brand" | "zinc" | "indigo";
  className?: string;
  imageUrl?: string;
}

const SIZES = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
  xl: "w-20 h-20 text-2xl",
};

const COLORS = {
  brand: "bg-brand-50 border-brand-100 text-brand-600",
  zinc: "bg-zinc-50 border-zinc-100 text-zinc-500",
  indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
};

// Pick a consistent color based on the name
function getColor(name: string): "brand" | "zinc" | "indigo" {
  const i = name.charCodeAt(0) % 3;
  return (["brand", "zinc", "indigo"] as const)[i];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ 
  name, 
  size = "md", 
  color, 
  className,
  imageUrl,
}: AvatarProps) {
  const c = color ?? getColor(name);
  
  return (
    <div
      className={clsx(
        "rounded-2xl border flex items-center justify-center font-medium shrink-0 shadow-sm",
        SIZES[size],
        COLORS[c],
        className
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${name} profile`} className="h-full w-full rounded-[inherit] object-cover" />
      ) : getInitials(name)}
    </div>
  );
}
