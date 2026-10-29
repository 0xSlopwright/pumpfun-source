import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { SiteFooter } from "./SiteFooter";
import { TopBar } from "./TopBar";
import { SearchDialog } from "./search/SearchDialog";
import { Suspense } from "react";

/**
 * The captured application shell: sidebar, sticky top bar, page container and footer.
 * Class names are the captured ones. Local changes are invisible ones: the column
 * that wraps header and footer is a <div> and only the page container is <main>,
 * and there is a skip link. The fixed mobile navigation precedes the header,
 * as in the captured segment, so its controls stay early in keyboard order.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[1000] focus:rounded-md focus:bg-bg-accent focus:px-3 focus:py-2 focus:text-[13px] focus:font-medium focus:text-text-on-accent"
      >
        Skip to main content
      </a>
      <AppSidebar />
      <MobileNav />
      <div
        data-shell-content=""
        className="relative flex flex-1 flex-col bg-bg-primary w-px md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow"
      >
        <div
          lang="en"
          className="pump-main-shell flex flex-col w-full min-h-screen bg-bg-primary pb-4 max-sm:pb-[calc(62px+env(safe-area-inset-bottom))] [--padding-x-main:24px] max-lg:[--padding-x-main:16px]"
        >
          <TopBar />
          <div className="pump-main-row min-w-0 w-full flex-1">
            <main
              id="main-content"
              tabIndex={-1}
              className="pump-page-container mx-auto flex w-full flex-1 flex-col max-w-screen-2xl px-[var(--padding-x-main)] pt-3 col-start-2 outline-none"
            >
              {children}
            </main>
          </div>
          <SiteFooter />
        </div>
      </div>
      <Suspense>
        <SearchDialog />
      </Suspense>
    </SidebarProvider>
  );
}
