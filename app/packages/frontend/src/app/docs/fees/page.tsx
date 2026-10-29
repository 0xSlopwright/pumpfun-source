import type { Metadata } from "next";

import ReferencePage from "../reference-page";

export const metadata: Metadata = {
  title: "Archived Fees",
  description: "Authenticated historical Pump fee reference rendered offline.",
};

export default function FeesPage() {
  return <ReferencePage documentKey="fees" />;
}
