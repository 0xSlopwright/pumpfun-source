import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreateCoinForm from "../create-coin-form";
import HolderRewardsInspector from "../holder-rewards-inspector";

const routes: Record<string, [string, string]> = {
  explore: ["Explore", "Search, filters, coin rankings and discovery."],
  "holder-rewards": [
    "Holder rewards",
    "Derive a holder-rewards PDA locally and optionally inspect its public account holdings. Reward eligibility and claims remain unavailable.",
  ],
  create: [
    "Create a coin",
    "Draft metadata and preview a local image without uploads, signing or token creation.",
  ],
};

function routeInfo(path: string) {
  return Object.hasOwn(routes, path) ? routes[path] : undefined;
}

type RoutePageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export function generateStaticParams() {
  return Object.keys(routes).map((path) => ({ slug: path.split("/") }));
}

export async function generateMetadata({
  params,
}: Pick<RoutePageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const info = routeInfo(slug.join("/"));
  return { title: info?.[0] ?? "Not found" };
}

export default async function Page({ params, searchParams }: RoutePageProps) {
  const { slug } = await params;
  const path = slug.join("/");
  const info = routeInfo(path);
  if (!info) notFound();

  const rawQuery = (await searchParams).q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  const isSearch = path === "explore" && Boolean(query?.trim());

  return (
    <>
      <p className="eyebrow">Pump reconstruction</p>
      <h1>{info[0]}</h1>
      <p className="description">{info[1]}</p>
      {isSearch ? (
        <p className="query-summary" aria-live="polite">
          Search query: <strong>{query}</strong>
        </p>
      ) : null}
      {path === "create" ? (
        <CreateCoinForm />
      ) : path === "holder-rewards" ? (
        <HolderRewardsInspector />
      ) : (
        <section className="empty-state" data-product-state="unavailable">
          <div className="empty-state-content">
            <span className="empty-mark" aria-hidden="true">
              P
            </span>
            <h2>
              {isSearch
                ? "Search results are unavailable"
                : "Feature unavailable"}
            </h2>
            <p>
              {isSearch
                ? "Your query is preserved in the URL. A native market-search service has not yet been reconstructed or qualified."
                : "This route remains a product scaffold while its native behavior and data contracts are reconstructed."}
            </p>
            <p className="muted">
              No fabricated live data, wallet action or production mutation is
              enabled.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
