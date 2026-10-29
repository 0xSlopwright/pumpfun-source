import Link from "next/link";

import {
  referenceLinkHref,
  type ReferenceBlock,
  type ReferenceDocument,
  type ReferenceInline,
  type ReferenceKey,
} from "./reference-data";
import { loadReferenceDocument } from "./reference-loader";
import "./reference-pages.css";

function InlineContent({ nodes }: { nodes: readonly ReferenceInline[] }) {
  return nodes.map((node, index) => {
    if (typeof node === "string") return node;
    const content = <InlineContent nodes={node.children} />;
    if (node.type === "strong") return <strong key={index}>{content}</strong>;
    const href = referenceLinkHref(node.href ?? "");
    return href.startsWith("/") ? (
      <Link href={href} key={index}>
        {content}
      </Link>
    ) : (
      <a
        href={href}
        key={index}
        {...(href.startsWith("https://")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {content}
      </a>
    );
  });
}

function ReferenceTable({ block }: { block: Extract<ReferenceBlock, { type: "table" }> }) {
  const [heading, ...body] = block.rows;
  return (
    <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Fee table">
      <table>
        <thead>
          <tr>
            {heading?.cells.map((cell, index) => (
              <th scope="col" key={index}>
                <InlineContent nodes={cell.children} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) =>
                cell.header ? (
                  <th scope="row" key={cellIndex}>
                    <InlineContent nodes={cell.children} />
                  </th>
                ) : (
                  <td key={cellIndex}>
                    <InlineContent nodes={cell.children} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReferenceBlockView({ block }: { block: ReferenceBlock }) {
  if (block.type === "heading") {
    const Heading = block.level === 2 ? "h2" : "h3";
    return (
      <Heading id={block.id} tabIndex={-1}>
        <a className="reference-heading-link" href={`#${block.id}`} aria-label={`Link to ${block.text}`}>
          {block.text}
        </a>
      </Heading>
    );
  }
  if (block.type === "paragraph") {
    return (
      <p>
        <InlineContent nodes={block.children} />
      </p>
    );
  }
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List>
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineContent nodes={item.children} />
          </li>
        ))}
      </List>
    );
  }
  return <ReferenceTable block={block} />;
}

function ReferenceArticle({ document }: { document: ReferenceDocument }) {
  const sections = document.blocks.filter(
    (block): block is Extract<ReferenceBlock, { type: "heading" }> =>
      block.type === "heading" && block.level === 2,
  );
  return (
    <article className="reference-page" aria-labelledby="reference-title">
      <header className="reference-header" id="reference-top">
        <p className="eyebrow">Archived reference</p>
        <h1 id="reference-title">{document.title}</h1>
        <p className="description">
          First-party content preserved from an authenticated public capture and rendered locally without loading the live site.
        </p>
        <aside className="reference-archive-note" aria-label="Archive authority">
          <strong>Historical copy:</strong> captured on{" "}
          <time dateTime={document.source.capturedAt}>28 October 2026</time>. This local reconstruction may not reflect the latest published document.
          {" "}<a href={document.officialUrl} target="_blank" rel="noreferrer noopener">View the official public page</a>.
        </aside>
      </header>

      <nav className="reference-toc" aria-labelledby="reference-contents-title">
        <h2 id="reference-contents-title">On this page</h2>
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.text}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="reference-document" data-testid="reference-document">
        {document.blocks.map((block, index) => (
          <ReferenceBlockView block={block} key={`${block.type}-${index}`} />
        ))}
      </div>

      <footer className="reference-provenance">
        <p>
          Source: <code>{document.source.path}</code>, SHA-256{" "}
          <code>{document.source.sha256}</code>.
        </p>
        <a href="#reference-top">Back to top</a>
      </footer>
    </article>
  );
}

export default async function ReferencePage({ documentKey }: { documentKey: ReferenceKey }) {
  const loaded = await loadReferenceDocument(documentKey);
  if (!loaded.ok) {
    return (
      <section className="reference-page" aria-labelledby="reference-title">
        <p className="eyebrow">Archived reference</p>
        <h1 id="reference-title">Reference unavailable</h1>
        <section className="reference-error" role="alert" data-testid="reference-evidence-error">
          <h2>Captured document failed validation</h2>
          <p>
            The checked-in source could not be authenticated, so no legal or fee content is shown. No live or invented fallback was used.
          </p>
        </section>
      </section>
    );
  }
  return <ReferenceArticle document={loaded.document} />;
}
