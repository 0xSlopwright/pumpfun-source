import type { Metadata } from "next";
import MayhemScreener from "./mayhem-screener";
import { normalizeMayhemFilter, normalizeMayhemSort } from "./mayhem-data";
import "./mayhem.css";

export const metadata: Metadata = {
  title: "Mayhem screener",
  description:
    "Evidence-backed reconstruction of the read-only Mayhem coin screener.",
};

type MayhemPageProps = {
  searchParams: Promise<{
    state?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function MayhemPage({ searchParams }: MayhemPageProps) {
  const parameters = await searchParams;
  return (
    <MayhemScreener
      initialFilter={normalizeMayhemFilter(parameters.state)}
      initialSort={normalizeMayhemSort(parameters.sort)}
    />
  );
}
