"use client";

type FilterTabsProps<T extends string> = {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
  label?: string;
};

/** Horizontal tab bar for filtering content. */
export function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  label = "Filter",
}: FilterTabsProps<T>) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return isActive ? (
          <strong key={tab} role="tab" aria-selected="true">
            {tab}
          </strong>
        ) : (
          <button
            key={tab}
            role="tab"
            aria-selected="false"
            type="button"
            className="cursor-pointer bg-transparent"
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
