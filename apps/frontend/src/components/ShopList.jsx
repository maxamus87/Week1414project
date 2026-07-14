import ShopCard from "./ShopCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function ShopList({ shops }) {
  if (shops.length === 0) {
    return <EmptyState text="No coffee shops match your search yet." />;
  }

  return (
    <ul className="shop-list">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </ul>
  );
}
