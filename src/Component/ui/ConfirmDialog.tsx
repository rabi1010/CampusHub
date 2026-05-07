import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        {/* Warning icon */}
        <div
          className="w-14 h-14 rounded-2xl bg-red-500/10
                        border border-red-500/20
                        flex items-center justify-center"
        >
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <div>
          <h3 className="font-display text-xl text-ink-50 mb-1">{title}</h3>
          <p className="text-sm text-ink-400 leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium
                       glass-light text-ink-300
                       hover:text-ink-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium
                       bg-red-500/80 hover:bg-red-500 text-white
                       transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading && (
              <span
                className="w-4 h-4 border-2 border-white/30
                               border-t-white rounded-full animate-spin"
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
