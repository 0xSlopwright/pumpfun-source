import Link from "next/link";

export type StreamCardData = {
  id: string;
  title: string;
  host: { name: string; avatar?: string };
  viewers: number;
  duration: string;
  coinTag?: string;
  isLive: boolean;
};

/** Card for a live stream or recording with metadata overlay. */
export function StreamCard({ stream }: { stream: StreamCardData }) {
  return (
    <Link
      href={`/live/${stream.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-secondary transition-colors hover:border-border-tertiary"
    >
      <div className="relative aspect-video bg-bg-primary">
        <div className="flex h-full w-full items-center justify-center text-text-muted">
          <svg
            aria-hidden="true"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="5" y="7" width="10" height="10" rx="2" />
            <path d="m15 10 4-2v8l-4-2Z" />
          </svg>
        </div>
        {stream.isLive ? (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            Live
          </span>
        ) : null}
        <span className="absolute bottom-2 right-2 rounded-md bg-bg-primary/80 px-1.5 py-0.5 text-[10px] font-semibold text-text-tertiary backdrop-blur-sm">
          {stream.duration}
        </span>
        {stream.coinTag ? (
          <span className="absolute right-2 top-2 rounded-md bg-bg-accent-inverse/80 px-1.5 py-0.5 text-[10px] font-bold text-text-accent backdrop-blur-sm">
            ${stream.coinTag}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-xs font-bold text-text-accent">
          {stream.host.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-text-primary group-hover:text-text-accent">
            {stream.title}
          </p>
          <p className="flex items-center gap-2 text-[11px] text-text-muted">
            <span>{stream.host.name}</span>
            <span>·</span>
            <span>{stream.viewers.toLocaleString()} viewers</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
