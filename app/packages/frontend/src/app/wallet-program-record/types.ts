export type StoredWalletRecord = {
  user: string;
  needsClaim: boolean;
  hasTotalClaimedTokens: boolean;
  totalUnclaimedTokens: string;
  totalClaimedTokens: string;
  currentSolVolume: string;
  lastUpdateTimestamp: string;
  cashbackEarned: string;
  totalCashbackClaimed: string;
  stableCashbackEarned: string;
  totalStableCashbackClaimed: string;
};
export type WalletRecordSuccess = {
  ok: true;
  address: string;
  programId: string;
  recordPda: string;
  cluster: "mainnet-beta";
  commitment: "confirmed";
  contextSlot: number;
  endpointHost: string;
  observedAt: string;
  dataBytes: number | null;
  record: StoredWalletRecord | null;
};
