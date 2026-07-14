import { Link } from "react-router-dom";

export default function ShopCard({ shop }) {
  const rating = Number(shop.averageRating) || 0;

  return (
    <li className="shop-card">
      <div className="shop-card__header">
        <h3>
          <Link to={`/shops/${shop.id}`}>{shop.name}</Link>
        </h3>
        <span className="shop-card__rating">
          {rating ? `★ ${rating.toFixed(1)}` : "No ratings yet"}
        </span>
      </div>
      <p className="shop-card__city">{shop.city}</p>
      {shop.description ? <p>{shop.description}</p> : null}
      <p className="shop-card__meta">{shop.reviewCount} review{shop.reviewCount === 1 ? "" : "s"}</p>
    </li>
  );
}
