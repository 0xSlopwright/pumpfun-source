import type { ReactNode } from 'react';

/** States plainly that a route is a scaffold, so placeholders are never mistaken for product data. */
export function ScaffoldNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-border-secondary bg-bg-secondary px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <div className="mx-auto mt-3 flex max-w-xl flex-col gap-2 text-[13px] leading-relaxed text-text-tertiary">{children}</div>
    </section>
  );
}
