import type { Metadata } from "next";
import { CopyMintButton, ExploreSearchForm } from "./explore-controls";
import { searchHistoricalCoins, type HistoricalCoin } from "./coin-data";
import { loadCoinSnapshot } from "./snapshot";
import "./explore.css";

export const metadata: Metadata = {
  title: "Explore",
  description: "Search a verified historical Pump coin snapshot offline.",
};

type ExplorePageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const capturedDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function CoinCard({ coin }: { coin: HistoricalCoin }) {
  const placeholder = coin.symbol.trim().slice(0, 2).toLocaleUpperCase("en-US");

  return (
    <article className="coin-card" data-testid="historical-coin-card">
      <div className="coin-card-heading">
        <span className="coin-placeholder" aria-label="Local image placeholder">
          {placeholder}
        </span>
        <div>
          <h2>{coin.name}</h2>
          <p className="coin-symbol">{coin.symbol}</p>
        </div>
      </div>

      <dl className="coin-facts">
        {coin.marketCapUsd === undefined ? null : (
          <div>
            <dt>Captured market cap (USD)</dt>
            <dd>{usd.format(coin.marketCapUsd)}</dd>
          </div>
        )}
        {coin.protocol === undefined ? null : (
          <div>
            <dt>Protocol</dt>
            <dd>{coin.protocol}</dd>
          </div>
        )}
      </dl>

      <div className="coin-mint">
        <span>Mint address</span>
        <code>{coin.mint}</code>
        <CopyMintButton mint={coin.mint} />
      </div>
      <p className="coin-image-note">
        The captured external image is intentionally not loaded offline.
      </p>
    </article>
  );
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const parameters = await searchParams;
  const rawQuery = Array.isArray(parameters.q) ? parameters.q[0] : parameters.q;
  const query = rawQuery ?? "";
  const normalizedQuery = query.trim();
  const loaded = await loadCoinSnapshot();

  if (!loaded.ok) {
    return (
      <section className="explore-page" aria-labelledby="explore-title">
        <p className="eyebrow">Historical evidence</p>
        <h1 id="explore-title">Explore</h1>
        <p className="description">
          Search the checked-in Pump coin snapshot without contacting a live
          market service.
        </p>
        <ExploreSearchForm initialQuery={query} />
        <section
          className="explore-message explore-message--error"
          role="alert"
          data-testid="explore-data-error"
        >
          <h2>Historical snapshot unavailable</h2>
          <p>
            The captured data did not pass local integrity and schema checks, so
            no coin records are displayed. No live fallback was attempted.
          </p>
        </section>
      </section>
    );
  }

  const { snapshot } = loaded;
  const results = searchHistoricalCoins(snapshot.coins, query);

  return (
    <section className="explore-page" aria-labelledby="explore-title">
      <header className="explore-header">
        <div>
          <p className="eyebrow">Historical evidence</p>
          <h1 id="explore-title">Explore</h1>
          <p className="description">
            Search one verified captured coin record. Results are historical,
            read-only and never refreshed from a production service.
          </p>
        </div>
        <div className="snapshot-badge">
          <span>Verified local snapshot</span>
          <time dateTime={snapshot.capturedAt}>
            {capturedDate.format(new Date(snapshot.capturedAt))} UTC
          </time>
        </div>
      </header>

      <ExploreSearchForm initialQuery={query} />

      <aside className="snapshot-scope" aria-label="Snapshot limitations">
        <strong>Local scope:</strong> this dataset contains exactly{" "}
        {snapshot.coins.length} historical record
        {snapshot.coins.length === 1 ? "" : "s"}. A missing result says nothing
        about the current live Pump market.
      </aside>

      <div className="explore-results-heading" aria-live="polite">
        <div>
          <p className="results-kicker">
            {normalizedQuery ? "Local search results" : "Captured record"}
          </p>
          <h2>
            {normalizedQuery
              ? `${results.length} local ${results.length === 1 ? "match" : "matches"}`
              : `${results.length} verified historical ${results.length === 1 ? "record" : "records"}`}
          </h2>
        </div>
        {normalizedQuery ? (
          <p className="query-value">
            Query: <strong>{normalizedQuery}</strong>
          </p>
        ) : null}
      </div>

      {results.length ? (
        <div className="coin-grid" aria-label="Historical coin results">
          {results.map((coin) => (
            <CoinCard coin={coin} key={coin.mint} />
          ))}
        </div>
      ) : (
        <section
          className="explore-message"
          data-testid="explore-no-results"
          aria-labelledby="no-local-results-title"
        >
          <h2 id="no-local-results-title">No matching local record</h2>
          <p>
            Nothing in this one-record historical snapshot matches your query.
            This is not a statement about live Pump market results.
          </p>
        </section>
      )}

      <footer className="explore-provenance">
        <p>
          Source: captured first-party <code>/coins?offset=0&amp;limit=1</code>{" "}
          response. SHA-256 <code>{snapshot.sha256}</code>.
        </p>
        <p>
          External images, token detail pages, wallet actions and trading are
          not enabled.
        </p>
      </footer>
    </section>
  );
}
