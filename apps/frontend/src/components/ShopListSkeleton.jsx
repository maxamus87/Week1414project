export default function ShopListSkeleton({ count = 6 }) {
  return (
    <ul className="shop-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <li className="shop-card shop-card--skeleton" key={index}>
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--text" />
          <div className="skeleton-line skeleton-line--text skeleton-line--short" />
        </li>
      ))}
    </ul>
  );
}
