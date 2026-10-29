export type GlobalHolderConfiguration = {
  status: "missing" | "decoded";
  dataBytes: number | null;
  isHolderRewardEnabled: boolean | null;
  holderRewardClaimAuthority: string | null;
};
export type CurveHolderConfiguration = {
  status: "missing" | "decoded";
  dataBytes: number | null;
  isHolderReward: boolean | null;
  creator: string | null;
  creatorMatchesHolderRewardsPda: boolean | null;
};
export type HolderConfiguration = {
  ok: true;
  mint: string;
  programId: string;
  globalPda: string;
  curvePda: string;
  holderRewardsPda: string;
  cluster: "mainnet-beta";
  commitment: "confirmed";
  contextSlot: number;
  observedAt: string;
  endpointHost: string;
  global: GlobalHolderConfiguration;
  curve: CurveHolderConfiguration;
};
export type HolderConfigurationFailure = {
  ok: false;
  error: { code: string; message: string; retryable: boolean };
};
