# Archived reference-page evidence

## Scope

This reconstruction renders three read-only first-party documents from the checked-in 28 October 2026 web capture:

- `/docs/fees`
- `/docs/privacy-policy`
- `/docs/terms-and-conditions`

They are historical references, not a statement that the text remains current. The local pages do not ask users to accept terms, calculate fees, contact an API, load the live site, or execute captured scripts.

## Observed capture authority

The records below are `OBSERVED` directly in `evidence/web/manifest.json`. Their object hashes and byte counts are independently recomputed by `scripts/extract-reference-pages.py` and `tests/reference_pages.test.ts`.

| Route | Captured object | Bytes | SHA-256 | HTTP evidence |
| --- | --- | ---: | --- | --- |
| `/docs/fees` | `evidence/web/objects/34f7b585a78296af` | 370,412 | `6e0dd8524a735bf232d28e2153ea3e835565dcbf653964acdac8f93168be2f72` | `200`, final URL `https://pump.fun/docs/fees`, `text/html; charset=utf-8` |
| `/docs/privacy-policy` | `evidence/web/objects/ecde4a73aafb477e` | 355,497 | `babc5695f31c07f667f321e2c4456ae37e478bc77eac77ca2b724878daf13cc7` | `200`, final URL `https://pump.fun/docs/privacy-policy`, `text/html; charset=utf-8` |
| `/docs/terms-and-conditions` | `evidence/web/objects/1e06d459af096a65` | 698,394 | `f6ffed345dfb40e8f8fc4fec31b522e10663d19783508849ba75642b16dd4be2` | `200`, final URL `https://pump.fun/docs/terms-and-conditions`, `text/html; charset=utf-8` |

The capture manifest timestamp is `2026-10-28T10:48:45.546100+00:00`. Each retained response includes a complete, server-rendered document beneath one uniquely identified `<main>` and direct `<h1>`. Some responses also contain unrelated captured application and Cloudflare scripts. Those scripts are never executed or copied into the local app; only the authenticated semantic document tree is extracted.

This evidence is distinct from `evidence/developer-docs.txt`, which is not used as authority for these public documents.

## Recovered content

All three documents visibly state `Last Updated: 17 October 2026` in the retained content.

### Fees

`OBSERVED`: title `Fees`, 7 level-two sections, 19 paragraphs, and 7 fee tables (71 table rows total). The recovered sections are:

1. Custom Pair coins
2. Holder Rewards coins
3. Trades routed through more than one pool
4. Cashback coins
5. EVM transactions
6. Platform Fee
7. Perpetuals Feature

Fee amounts, units, conditions, table labels, and links are preserved as captured. The reconstruction does not derive, simplify, or recalculate them.

### Privacy notice

`OBSERVED`: title `Privacy Notice`, 16 level-two sections, 7 level-three sections, 62 paragraphs, and 4 unordered lists containing 43 items. Recovered top-level topics include collection, cookies, processing, communications, sharing, retention, security, voice/livestream data, blockchain transactions, overseas disclosure, and general provisions.

### Terms of use

`OBSERVED`: title `Terms Of Use`, 36 level-two sections, 2 level-three sections, 482 paragraphs, and 4 unordered lists containing 14 items. The full captured sequence includes `RISK WARNING`, numbered sections 1–32, sections 30A and 30B, and the level-three `7.3 Hackathon Terms` and `7.4 Tokenized Agent` sections.

## Extraction and confidence

| Element | Classification | Basis |
| --- | --- | --- |
| Titles, headings, paragraphs, lists, tables, visible links, dates, and fee text | `OBSERVED` | Direct server-rendered HTML in authenticated objects |
| HTTP identity, capture time, content type, byte count, and object hash | `OBSERVED` | Checked-in capture manifest plus recomputation |
| These pages represented public first-party documents at capture time | `DECLARED` | First-party URLs, successful final URLs, and document metadata |
| Current legal authority or current fee schedule | `UNKNOWN` | No live request or later authenticated publication is consulted |
| Table of contents, archive warning, provenance footer, and responsive table wrapper | `LOCAL DESIGN` | Safe local reading aids, not claimed as original presentation |
| Original visual parity | `UNKNOWN` | No equivalent authenticated screenshots were available for comparison |

No Turbopack factory is used as text authority. Because the complete documents are directly present in retained HTML, module IDs, factory hashes, source paths, and UTF-16 ranges are not needed to infer document content. `recovered/modules.json` remains immutable, and no captured bundle is executed.

## Fail-closed pipeline

`scripts/extract-reference-pages.py` pins each route, final URL, status, object path, byte count, SHA-256, content type, title, and structural counts. It statically parses the retained HTML with Python's standard-library parser, accepts only the required semantic elements, rejects unexpected block and inline structures, permits only internal, HTTPS, and `mailto:` links, requires unique section identities and required fee markers, then writes `reference-pages.generated.json`.

The server loader independently rechecks the captured object and manifest before returning a document. On missing, corrupted, duplicated, stale, or unsupported evidence, the route displays a local validation error and does not substitute live or invented text.

Run:

```sh
cd app
python3 scripts/extract-reference-pages.py --check
pnpm test:references
pnpm --filter @pump-reconstruction/frontend exec playwright test tests/reference-pages.spec.ts
```

## Offline and safety boundary

- The renderer uses typed React elements; it never uses `dangerouslySetInnerHTML`.
- Captured scripts, event handlers, style tags, and application chrome are excluded.
- External links are inert until activated and use safe new-tab semantics; no external resource is embedded.
- Local navigation keeps the three copied documents and home on this app. The ten retained links to nine uncopied document routes resolve against `https://pump.fun`, so they open the original destination instead of a local 404. This is a `LOCAL DESIGN` navigation choice; captured links, generated blocks, and content hashes remain unchanged.
- Rendering performs no production API call, mutation, RPC request, wallet interaction, upload, or transaction.
- Visiting a reconstructed document does not constitute acceptance.
- The archived label links to the corresponding official public URL and explicitly says the local copy may be outdated.

## Visual evidence and limitations

Baseline and local screenshots at 1440×900, 768×1024, 390×844, and 375×812 are indexed in `visual/reference-pages-20261028/README.md`. They establish local scaffold replacement, responsive readability, and lack of page-level horizontal overflow. They do not establish pixel parity.

The implementation qualifies deterministic offline rendering of the captured documents only. Current publication status, later amendments, live fee calculations, legal interpretation, and original visual parity remain unqualified.
