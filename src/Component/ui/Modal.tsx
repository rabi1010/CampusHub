import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-6 bg-zinc-950/55 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={clsx(
          "relative w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200",
          "flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] animate-fade-up",
          SIZES[size],
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
            <div>
              <h2 className="font-display text-lg font-medium text-zinc-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors ml-4 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="min-h-0 overflow-y-auto flex-1 px-4 py-4 sm:px-6 sm:py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
