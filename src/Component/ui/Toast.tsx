import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

// ── Types ───────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
  };
}

// ── Context ─────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ── Config ──────────────────────────────────────────────
const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "border-jade-500/30 bg-jade-500/10",
  error: "border-red-500/30  bg-red-500/10",
  warning: "border-gold-500/30 bg-gold-500/10",
  info: "border-ink-400/30  bg-ink-400/10",
};

const ICON_STYLES = {
  success: "text-jade-400",
  error: "text-red-400",
  warning: "text-gold-400",
  info: "text-ink-300",
};

// ── Individual toast item ────────────────────────────────
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICONS[toast.type];

  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 rounded-2xl",
        "glass border shadow-card-lg",
        "w-80 animate-fade-up",
        STYLES[toast.type],
      )}
    >
      <Icon
        size={18}
        className={clsx("shrink-0 mt-0.5", ICON_STYLES[toast.type])}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-100">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-ink-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-ink-500 hover:text-ink-300
                   transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Provider ─────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const add = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, type, title, message }]);
      // Auto-dismiss after 4 seconds
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const toast = {
    success: (title: string, message?: string) =>
      add("success", title, message),
    error: (title: string, message?: string) => add("error", title, message),
    warning: (title: string, message?: string) =>
      add("warning", title, message),
    info: (title: string, message?: string) => add("info", title, message),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — fixed bottom right */}
      <div
        className="fixed bottom-6 right-6 z-[100]
                   flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
