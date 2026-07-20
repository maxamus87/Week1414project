import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";

const AVATAR_COLORS = ["#c2954f", "#b8763a", "#8a6a4a", "#9a7256", "#a68f5e", "#7a5230"];

function avatarColor(shop) {
  const key = shop.name || "";
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function ShopCard({ shop, extra, index = 0 }) {
  const rating = Number(shop.averageRating) || 0;

  return (
    <li className="shop-card" style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}>
      <div className="shop-card__header">
        <div className="shop-card__title-block">
          <span className="shop-card__avatar" style={{ background: avatarColor(shop) }} aria-hidden="true">
            {shop.name?.charAt(0).toUpperCase()}
          </span>
          <span className="shop-card__title-text">
            <h3>
              <Link to={`/shops/${shop.id}`}>{shop.name}</Link>
            </h3>
            <span className="shop-card__city">{shop.city}, {shop.state}</span>
          </span>
        </div>
        {rating ? (
          <span className="shop-card__rating">
            <StarRating rating={rating} size={14} />
            {rating.toFixed(1)}
          </span>
        ) : (
          <span className="shop-card__rating shop-card__rating--empty">No ratings yet</span>
        )}
      </div>
      <hr className="shop-card__divider" />
      {shop.description ? <p>{shop.description}</p> : null}
      <p className="shop-card__meta">
        {shop.reviewCount} review{shop.reviewCount === 1 ? "" : "s"}
        {shop.distance != null ? ` · ${shop.distance.toFixed(1)} mi away` : ""}
      </p>
      {extra}
    </li>
  );
}
