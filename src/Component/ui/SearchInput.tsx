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
  const [input, setInput] = useState({ local: value, value });

  if (input.value !== value) {
    setInput({ local: value, value });
  }

  const local = input.local;

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), debounce);
    return () => clearTimeout(timer);
  }, [local, debounce, onChange]);

  return (
    <div className={clsx("relative group", className)}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-brand-500 transition-colors"
      />
      <input
        type="text"
        value={local}
        onChange={(e) => setInput({ local: e.target.value, value })}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-zinc-50 border border-zinc-100 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-500/5 transition-all duration-200"
      />
      {local && (
        <button
          onClick={() => {
            setInput({ local: "", value });
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
