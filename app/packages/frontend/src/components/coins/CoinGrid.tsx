import { SkeletonCard } from "@/components/ui/Skeleton";
import { CoinCard, type CoinCardData } from "./CoinCard";

type CoinGridProps = {
  coins: CoinCardData[];
  loading?: boolean;
  skeletonCount?: number;
};

/** Responsive grid of coin cards with loading skeleton state. */
export function CoinGrid({
  coins,
  loading = false,
  skeletonCount = 12,
}: CoinGridProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-busy="true"
      >
        {Array.from({ length: skeletonCount }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {coins.map((coin) => (
        <CoinCard key={coin.address} coin={coin} />
      ))}
    </div>
  );
}
