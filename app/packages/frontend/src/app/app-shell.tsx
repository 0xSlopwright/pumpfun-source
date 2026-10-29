"use client";

import Link from "next/link";
import { SignInControl } from "./auth/sign-in-control";
import SettingsControl from "../components/settings/settings-control";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type IconName =
  | "home"
  | "explore"
  | "leaderboard"
  | "live"
  | "go"
  | "mayhem"
  | "rewards"
  | "portfolio"
  | "create"
  | "search"
  | "menu"
  | "close";

type NavItem = { href: string; label: string; icon: IconName };

const primaryNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/explore", label: "Explore", icon: "explore" },
  { href: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
  { href: "/live", label: "Live", icon: "live" },
];

const discoverNavigation: NavItem[] = [
  { href: "/portfolio", label: "Portfolio", icon: "portfolio" },
  { href: "/go", label: "GO", icon: "go" },
  { href: "/mayhem", label: "Mayhem", icon: "mayhem" },
  { href: "/holder-rewards", label: "Holder rewards", icon: "rewards" },
];

const legalNavigation = [
  { href: "/docs/fees", label: "Fees" },
  { href: "/docs/privacy-policy", label: "Privacy" },
  { href: "/docs/terms-and-conditions", label: "Terms" },
];

function Icon({ name }: { name: IconName }) {
  const common = {
    "aria-hidden": true,
    className: "shell-icon",
    fill: "none",
    viewBox: "0 0 24 24",
  } as const;

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z" />
      </svg>
    );
  }
  if (name === "explore") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="m15.5 8.5-2 5-5 2 2-5Z" />
      </svg>
    );
  }
  if (name === "leaderboard") {
    return (
      <svg {...common}>
        <path d="M5 20v-7h4v7m2 0V4h4v16m2 0v-10h3v10M3 20h18" />
      </svg>
    );
  }
  if (name === "live") {
    return (
      <svg {...common}>
        <rect x="5" y="7" width="10" height="10" rx="2" />
        <path d="m15 10 4-2v8l-4-2Z" />
      </svg>
    );
  }
  if (name === "go") {
    return (
      <svg {...common}>
        <path d="M5 13 11 3l1 7h7l-6 11-1-8Z" />
      </svg>
    );
  }
  if (name === "mayhem") {
    return (
      <svg {...common}>
        <path d="M12 3 9.8 8.7 4 7l3.3 5L3 16l6 .5L10 22l3-5 6 2-2.8-5.2L21 10l-6-.4Z" />
      </svg>
    );
  }
  if (name === "rewards") {
    return (
      <svg {...common}>
        <path d="M4 9h16v11H4Zm8 0v11M3 9h18V6H3Zm9-3c-1-4-6-3-5 0m5 0c1-4 6-3 5 0" />
      </svg>
    );
  }
  if (name === "portfolio") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="13" rx="3" />
        <path d="M3 10h18m-5 4h2" />
      </svg>
    );
  }
  if (name === "create") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand brand--compact" : "brand"}>
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span className="brand-wordmark">pump.fun</span>
    </span>
  );
}

function SearchFallback() {
  return (
    <div className="search-control search-control--fallback" aria-hidden="true">
      <Icon name="search" />
      <span>Search for coins and users...</span>
    </div>
  );
}

function SearchNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) {
      router.push("/explore");
      return;
    }
    router.push(
      `/explore?${new URLSearchParams({ q: normalized }).toString()}`,
    );
  }

  function clear() {
    setQuery("");
    if (pathname === "/explore" && currentQuery) router.push("/explore");
  }

  return (
    <form className="search-control" role="search" onSubmit={submit}>
      <Icon name="search" />
      <label className="sr-only" htmlFor="global-search">
        Search for coins and users
      </label>
      <input
        id="global-search"
        name="q"
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        placeholder="Search for coins and users..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query ? (
        <button
          className="search-clear"
          type="button"
          aria-label="Clear search"
          onClick={clear}
        >
          <Icon name="close" />
        </button>
      ) : null}
      <button className="search-submit" type="submit">
        Search
      </button>
    </form>
  );
}

function NavigationGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label?: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="navigation-group">
      {label ? <p className="navigation-label">{label}</p> : null}
      <ul>
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                className="navigation-link"
                data-active={active}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                href={item.href}
                onClick={onNavigate}
                title={item.label}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigationId = useId();
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
      if (!mediaQuery.matches) setMobileOpen(false);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) closeButtonRef.current?.focus();
  }, [mobileOpen]);

  const closeNavigation = (restoreFocus = false) => {
    setMobileOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  const keepFocusInNavigation = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!isMobile || !mobileOpen || event.key !== "Tab") return;
    const focusable = Array.from(
      navigationRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="app-shell"
      data-mobile-navigation={mobileOpen ? "open" : "closed"}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <button
        className="mobile-backdrop"
        type="button"
        aria-label="Close navigation"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => closeNavigation(true)}
      />
      <aside
        className="sidebar"
        id={navigationId}
        ref={navigationRef}
        aria-label="Application navigation"
        aria-hidden={isMobile && !mobileOpen ? true : undefined}
        inert={isMobile && !mobileOpen}
        onKeyDown={keepFocusInNavigation}
      >
        <div className="sidebar-heading">
          <Link
            href="/"
            aria-label="Pump reconstruction home"
            onClick={() => closeNavigation()}
          >
            <Brand />
          </Link>
          <button
            className="mobile-close"
            type="button"
            aria-label="Close navigation"
            ref={closeButtonRef}
            onClick={() => closeNavigation(true)}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Primary">
          <NavigationGroup
            items={primaryNavigation}
            pathname={pathname}
            onNavigate={() => closeNavigation()}
          />
          <NavigationGroup
            label="Discover"
            items={discoverNavigation}
            pathname={pathname}
            onNavigate={() => closeNavigation()}
          />
        </nav>
        <div className="sidebar-actions">
          <Link
            className="create-link"
            data-active={pathname === "/create"}
            aria-current={pathname === "/create" ? "page" : undefined}
            aria-label="Create a coin"
            href="/create"
            title="Create a coin"
            onClick={() => closeNavigation()}
          >
            <Icon name="create" />
            <span>Create a coin</span>
          </Link>
        </div>
        <footer className="sidebar-footer">
          <SettingsControl />
          <div className="legal-links" aria-label="Reference links">
            {legalNavigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => closeNavigation()}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p>Local reconstruction</p>
        </footer>
      </aside>

      <div className="shell-content" inert={isMobile && mobileOpen}>
        <header className="topbar">
          <div className="mobile-brand-row">
            <button
              className="mobile-menu"
              type="button"
              aria-label="Open navigation"
              aria-controls={navigationId}
              aria-expanded={mobileOpen}
              ref={menuButtonRef}
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <Link href="/" aria-label="Pump reconstruction home">
              <Brand compact />
            </Link>
          </div>
          <Suspense fallback={<SearchFallback />}>
            <SearchNavigation />
          </Suspense>
          <SignInControl />
          <span className="local-status">
            <span aria-hidden="true" />
            Local reconstruction
          </span>
        </header>
        <main id="main-content" tabIndex={-1}>
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
