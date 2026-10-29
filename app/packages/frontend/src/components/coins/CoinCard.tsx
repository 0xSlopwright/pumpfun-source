import Link from "next/link";

export type CoinCardData = {
  address: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  marketCap: string;
  price: string;
  change24h: number;
  creator: string;
  replyCount: number;
};

/** Card displaying a single token with key metrics. */
export function CoinCard({ coin }: { coin: CoinCardData }) {
  const changeColor = coin.change24h >= 0 ? "positive" : "negative";
  const changePrefix = coin.change24h >= 0 ? "+" : "";

  return (
    <Link
      href={`/coin/${coin.address}`}
      className="group flex flex-col rounded-xl border border-border-secondary bg-bg-secondary p-3 transition-colors hover:border-border-tertiary hover:bg-bg-tertiary"
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-bg-primary">
        {coin.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coin.imageUrl}
            alt={coin.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-accent">
            {coin.symbol.slice(0, 2)}
          </div>
        )}
        <span className="absolute right-2 top-2 rounded-md bg-bg-primary/80 px-1.5 py-0.5 text-[10px] font-bold text-text-tertiary backdrop-blur-sm">
          ${coin.symbol}
        </span>
      </div>
      <h3 className="truncate text-[13px] font-semibold text-text-primary">
        {coin.name}
      </h3>
      <p className="mt-0.5 truncate text-[11px] text-text-tertiary">
        by {coin.creator}
      </p>
      <div className="mt-auto flex items-baseline justify-between gap-2 pt-3">
        <span className="text-xs text-text-secondary">
          MC {coin.marketCap}
        </span>
        <span className={`text-xs font-semibold ${changeColor}`}>
          {changePrefix}
          {coin.change24h.toFixed(1)}%
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-text-muted">
        <span>{coin.price}</span>
        <span>{coin.replyCount} replies</span>
      </div>
    </Link>
  );
}
