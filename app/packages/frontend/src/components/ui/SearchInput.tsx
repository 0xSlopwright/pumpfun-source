"use client";

import { useEffect, useRef, useState } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

/** Debounced search input with clear button. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(next: string) {
    setLocal(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), debounceMs);
  }

  function clear() {
    setLocal("");
    onChange("");
  }

  return (
    <div className="relative flex h-10 w-full min-w-0 items-center rounded-xl border border-border-secondary bg-bg-secondary transition-colors focus-within:border-zinc-600">
      <svg
        aria-hidden="true"
        className="ml-3 h-4 w-4 shrink-0 text-text-tertiary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        className="h-full w-full min-w-0 border-0 bg-transparent px-2 text-[13px] text-text-primary outline-none placeholder:text-text-muted"
      />
      {local ? (
        <button
          type="button"
          aria-label="Clear search"
          className="mr-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-transparent text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
          onClick={clear}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
