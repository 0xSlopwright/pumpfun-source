import { holderRewardsPda } from "@pump-fun/pump-sdk/swap";
import { PublicKey } from "@solana/web3.js";

export type HolderRewardsDerivation =
  | {
      ok: true;
      mint: string;
      holderRewardsPda: string;
    }
  | {
      ok: false;
      error: string;
    };

/**
 * Normalize a Solana public key and derive its Pump holder-rewards PDA.
 * This is deterministic local computation only; it does not establish that
 * either address exists on-chain or participates in holder rewards.
 */
export function deriveHolderRewardsAddress(
  rawMint: string,
): HolderRewardsDerivation {
  const value = rawMint.trim();
  if (!value) {
    return { ok: false, error: "Enter a Solana mint address." };
  }

  try {
    const mint = new PublicKey(value);
    return {
      ok: true,
      mint: mint.toBase58(),
      holderRewardsPda: holderRewardsPda(mint).toBase58(),
    };
  } catch {
    return {
      ok: false,
      error: "Enter a valid Base58 Solana public key (32 decoded bytes).",
    };
  }
}
