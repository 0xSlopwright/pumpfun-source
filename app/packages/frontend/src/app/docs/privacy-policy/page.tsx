import type { Metadata } from "next";

import ReferencePage from "../reference-page";

export const metadata: Metadata = {
  title: "Archived Privacy Notice",
  description: "Authenticated historical Pump privacy notice rendered offline.",
};

export default function PrivacyPage() {
  return <ReferencePage documentKey="privacy" />;
}
