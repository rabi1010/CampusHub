import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    // Backdrop
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center
                 p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        // Close when clicking backdrop — not the modal itself
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Modal panel */}
      <div
        className={clsx(
          "w-full glass rounded-2xl shadow-card-lg",
          "flex flex-col max-h-[90vh] animate-fade-up",
          SIZES[size],
        )}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between
                        px-6 py-5 border-b border-white/[0.07] shrink-0"
        >
          <div>
            <h2 className="font-display text-lg text-ink-50">{title}</h2>
            {subtitle && (
              <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-500
                       hover:text-ink-200 hover:bg-white/5
                       transition-colors ml-4 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
