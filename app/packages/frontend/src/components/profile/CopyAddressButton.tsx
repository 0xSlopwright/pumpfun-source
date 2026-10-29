"use client";

import { useState } from "react";

export function CopyAddressButton({ address }: { address: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className="profile-copy-control">
      <button
        type="button"
        onClick={copyAddress}
        aria-label="Copy wallet address"
      >
        Copy address
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "copied"
          ? "Wallet address copied"
          : status === "failed"
            ? "Wallet address could not be copied"
            : ""}
      </span>
    </span>
  );
}
