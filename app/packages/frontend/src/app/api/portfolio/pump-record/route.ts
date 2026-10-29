import "server-only";
import { handleWalletRecord } from "../../../wallet-program-record/handler";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return handleWalletRecord(request);
}
