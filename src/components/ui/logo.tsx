import { cn } from "../../lib/utils";

interface LogoProps {
  variant?: "default" | "inverted" | "dark";
  showTagline?: boolean;
  className?: string;
}

export default function Logo({
  variant = "default",
  showTagline = false,
  className,
}: LogoProps) {
  const styles = {
    default: {
      wrap: "text-foreground",
      accent: "text-primary",
      dot: "bg-primary",
      tag: "text-muted-foreground",
    },
    inverted: {
      wrap: "text-white",
      accent: "text-white",
      dot: "bg-white",
      tag: "text-white/60",
    },
    dark: {
      wrap: "text-white",
      accent: "text-primary",
      dot: "bg-primary",
      tag: "text-primary",
    },
  }[variant];

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      <div
        className={cn(
          "flex items-center gap-1 font-display font-medium text-xl tracking-tight",
          styles.wrap,
        )}
      >
        <span className="text-base">◈</span>
        <span className={styles.accent}>Lu</span>minary
        <span
          className={cn(
            "w-2 h-2 rounded-full ml-0.5 mb-0.5 inline-block",
            styles.dot,
          )}
        />
      </div>
      {showTagline && (
        <span
          className={cn(
            "text-[10px] font-medium tracking-[0.18em] uppercase",
            styles.tag,
          )}
        >
          Illuminate your learning
        </span>
      )}
    </div>
  );
}
