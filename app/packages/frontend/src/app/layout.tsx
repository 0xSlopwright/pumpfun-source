import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { ClickwrapDialog } from "@/components/shell/ClickwrapDialog";
import {
  CLICKWRAP_STATE_SCRIPT,
  CLICKWRAP_INERT_SCRIPT,
} from "@/components/shell/clickwrap";
import "./globals.css";
import "./captured-shell.css";

export const metadata: Metadata = {
  title: {
    default: "Pump reconstruction",
    template: "%s · Pump reconstruction",
  },
  description:
    "Local, evidence-backed Pump application reconstruction workspace",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-pf-auth="out" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: CLICKWRAP_STATE_SCRIPT }} />
        <ClickwrapDialog />
        <AppShell>{children}</AppShell>
        <script dangerouslySetInnerHTML={{ __html: CLICKWRAP_INERT_SCRIPT }} />
      </body>
    </html>
  );
}
