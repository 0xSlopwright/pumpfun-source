'use client';

import type { MenuEntry } from '@/config/navigation';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from './captured-icons';

/** A footer link group that opens upward from the desktop footer row. */
export function FooterMenu({ title, links }: { title: string; links: readonly MenuEntry[] }) {
  return (
    <DropdownMenu
      label={title}
      items={links}
      placement="top-start"
      renderTrigger={(props) => (
        <button
          {...props}
          className="text-text-tertiary transition-colors hover:text-text-primary group inline-flex items-center gap-1 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-accent"
        >
          {title}
          <ChevronDownIcon />
        </button>
      )}
    />
  );
}
