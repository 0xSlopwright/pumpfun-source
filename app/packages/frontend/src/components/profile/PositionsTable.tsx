export type PositionRow = {
  token: string;
  symbol: string;
  amount: string;
  avgBuy: string;
  current: string;
  pnl: string;
  pnlPercent: number;
};

/** Positions table with color-coded PnL. */
export function PositionsTable({ rows }: { rows: PositionRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">
        No positions to display.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-border-secondary text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            <th className="pb-3 pr-4">Token</th>
            <th className="pb-3 pr-4 text-right">Amount</th>
            <th className="hidden pb-3 pr-4 text-right sm:table-cell">
              Avg Buy
            </th>
            <th className="pb-3 pr-4 text-right">Current</th>
            <th className="pb-3 pr-4 text-right">PnL</th>
            <th className="pb-3 text-right">PnL %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const color = r.pnlPercent >= 0 ? "positive" : "negative";
            const prefix = r.pnlPercent >= 0 ? "+" : "";
            return (
              <tr
                key={r.symbol}
                className="border-b border-border-secondary/50 text-text-secondary"
              >
                <td className="py-3 pr-4">
                  <div>
                    <span className="font-semibold text-text-primary">
                      {r.token}
                    </span>
                    <span className="ml-1.5 text-[11px] text-text-muted">
                      ${r.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-xs">
                  {r.amount}
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-xs sm:table-cell">
                  {r.avgBuy}
                </td>
                <td className="py-3 pr-4 text-right font-mono text-xs">
                  {r.current}
                </td>
                <td className={`py-3 pr-4 text-right font-mono text-xs ${color}`}>
                  {r.pnl}
                </td>
                <td className={`py-3 text-right font-mono text-xs font-semibold ${color}`}>
                  {prefix}
                  {r.pnlPercent.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
