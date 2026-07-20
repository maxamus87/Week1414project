import ShopCard from "./ShopCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function ShopList({ shops, renderExtra }) {
  if (shops.length === 0) {
    return <EmptyState text="No coffee shops match your search yet." />;
  }

  return (
    <ul className="shop-list">
      {shops.map((shop, index) => (
        <ShopCard key={shop.id} shop={shop} index={index} extra={renderExtra ? renderExtra(shop) : null} />
      ))}
    </ul>
  );
}
