export default function ShopDetailSkeleton() {
  return (
    <section className="panel" aria-hidden="true">
      <div className="shop-detail__header">
        <div style={{ flex: 1 }}>
          <div className="skeleton-line skeleton-line--title" style={{ width: "45%", marginBottom: 10 }} />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </div>
      <div className="skeleton-line skeleton-line--text" style={{ marginTop: 20 }} />
      <div className="skeleton-line skeleton-line--text" />
      <div className="skeleton-line skeleton-line--short" />
    </section>
  );
}
