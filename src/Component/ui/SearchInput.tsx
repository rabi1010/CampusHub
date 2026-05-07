import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // ms delay, default 300
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  className,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // Debounce — only call onChange after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => onChange(local), debounce);
    return () => clearTimeout(timer);
  }, [local, debounce, onChange]);

  // Sync if parent resets value
  useEffect(() => setLocal(value), [value]);

  return (
    <div className={clsx("relative", className)}>
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2
                   text-ink-500 pointer-events-none"
      />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm
                   bg-white/5 border border-white/[0.08]
                   text-ink-200 placeholder-ink-600
                   focus:outline-none focus:border-jade-500/40
                   focus:bg-white/10 transition-all duration-200"
      />
      {local && (
        <button
          onClick={() => {
            setLocal("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-ink-500 hover:text-ink-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
