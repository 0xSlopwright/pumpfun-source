"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

export function ExploreSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const pendingClear = useRef(false);

  useEffect(() => {
    // Clear has already emptied the input; its delayed response must not
    // overwrite a draft typed since the click.
    const completedClear = pendingClear.current && initialQuery === "";
    pendingClear.current = false;
    if (!completedClear) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onPopState = () => {
      pendingClear.current = false;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pendingClear.current = false;
    const normalized = query.trim();
    router.push(
      normalized
        ? `/explore?${new URLSearchParams({ q: normalized }).toString()}`
        : "/explore",
    );
  }

  function clear() {
    pendingClear.current = initialQuery !== "";
    setQuery("");
    router.push("/explore");
  }

  return (
    <form
      className="explore-search"
      role="search"
      aria-label="Search the historical coin snapshot"
      onSubmit={submit}
    >
      <label htmlFor="explore-search-input">Search captured coins</label>
      <div className="explore-search-row">
        <input
          id="explore-search-input"
          name="q"
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Name, symbol or mint address"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button className="explore-clear" type="button" onClick={clear}>
            Clear
          </button>
        ) : null}
        <button className="explore-submit" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}

export function CopyMintButton({ mint }: { mint: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(mint);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className="copy-mint-control">
      <button type="button" onClick={copy} aria-label={`Copy mint ${mint}`}>
        Copy mint
      </button>
      <span className="copy-mint-status" aria-live="polite">
        {status === "copied"
          ? "Mint copied"
          : status === "failed"
            ? "Copy unavailable"
            : ""}
      </span>
    </span>
  );
}
