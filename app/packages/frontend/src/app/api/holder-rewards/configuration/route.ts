import "server-only";
import { handleHolderConfiguration } from "../../../holder-rewards-config/handler";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return handleHolderConfiguration(request);
}
