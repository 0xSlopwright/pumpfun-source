import type { Metadata } from "next";

import ReferencePage from "../reference-page";

export const metadata: Metadata = {
  title: "Archived Terms of Use",
  description: "Authenticated historical Pump terms of use rendered offline.",
};

export default function TermsPage() {
  return <ReferencePage documentKey="terms" />;
}
