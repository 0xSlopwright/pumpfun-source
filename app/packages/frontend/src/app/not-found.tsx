import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state" data-product-state="not-found">
      <div className="empty-state-content">
        <span className="empty-mark" aria-hidden="true">
          404
        </span>
        <h1>Page not reconstructed</h1>
        <p>
          This route is unknown, excluded from the current scope, or not yet
          available in the local application.
        </p>
        <p>
          <Link className="page-heading-link" href="/">
            Return home
          </Link>
        </p>
      </div>
    </section>
  );
}
