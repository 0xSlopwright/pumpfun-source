"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent } from "react";

export type FeedTab = "for-you" | "following" | "local-callouts";

const offlineTabs = [
  { id: "for-you" as const, label: "For you", href: "/" },
  {
    id: "following" as const,
    label: "Following",
    href: "/?tab=following",
  },
];

export function FeedTabs({
  activeTab,
  nativeEnabled,
}: {
  activeTab: FeedTab;
  nativeEnabled: boolean;
}) {
  const router = useRouter();
  const pendingKeyboardFocus = useRef(false);
  // Keys compose against the last request while the server commits the previous one.
  const requestedTab = useRef(activeTab);
  const tabs = nativeEnabled
    ? [
        ...offlineTabs,
        {
          id: "local-callouts" as const,
          label: "Local callouts",
          href: "/?tab=local-callouts&nativeView=ranked",
        },
      ]
    : offlineTabs;

  useEffect(() => {
    requestedTab.current = activeTab;
    if (!pendingKeyboardFocus.current) return;
    pendingKeyboardFocus.current = false;
    document.getElementById(`feed-tab-${activeTab}`)?.focus();
  }, [activeTab]);

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    const currentIndex = tabs.findIndex(
      (tab) => tab.id === requestedTab.current,
    );
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const next = tabs[nextIndex];
    requestedTab.current = next.id;
    pendingKeyboardFocus.current = true;
    router.push(next.href);
  }

  return (
    <nav className="feed-tabs" role="tablist" aria-label="Feed views">
      {tabs.map((tab) => {
        const selected = tab.id === activeTab;
        return (
          <Link
            id={`feed-tab-${tab.id}`}
            key={tab.id}
            role="tab"
            aria-selected={selected}
            aria-controls="home-feed-panel"
            tabIndex={selected ? 0 : -1}
            data-active={selected}
            href={tab.href}
            onKeyDown={handleKeyDown}
            onNavigate={() => {
              // A real SPA activation wins over an earlier keyboard request.
              requestedTab.current = tab.id;
              pendingKeyboardFocus.current = false;
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
