import type { NextRequest } from "next/server";
import { loadGoEvidence } from "../../go/evidence";
import {
  GoQueryError,
  parseGoQuery,
  queryArchivedBounties,
} from "../../go/go-data";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  let query;
  try {
    query = parseGoQuery(request.nextUrl.searchParams);
  } catch (error) {
    return Response.json(
      {
        code: "INVALID_GO_QUERY",
        message:
          error instanceof GoQueryError
            ? error.message
            : "The GO query is invalid",
      },
      { status: 400 },
    );
  }

  const evidence = await loadGoEvidence();
  if (!evidence.ok) {
    return Response.json(
      {
        code: "GO_EVIDENCE_UNAVAILABLE",
        message:
          "The authenticated local GO archive did not pass integrity checks.",
      },
      { status: 503 },
    );
  }

  return Response.json(queryArchivedBounties(evidence.snapshot, query), {
    headers: {
      "Cache-Control": "no-store",
      "X-Pump-Data-Source": "archived-go-html",
    },
  });
}
