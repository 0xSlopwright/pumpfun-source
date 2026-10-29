"use client";

type SortDropdownProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
};

/** Dropdown for sorting results. */
export function SortDropdown<T extends string>({
  options,
  value,
  onChange,
  label = "Sort by",
}: SortDropdownProps<T>) {
  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-text-tertiary">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 min-w-[140px] rounded-lg border border-border-tertiary bg-bg-primary px-3 text-[13px] text-text-primary outline-none focus:border-bg-accent"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
