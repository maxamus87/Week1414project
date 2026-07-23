import { useEffect, useRef, useState } from "react";
import ShopCard from "./ShopCard.jsx";
import EmptyState from "./EmptyState.jsx";

const PAGE_SIZE = 6;
const SWIPE_THRESHOLD_PX = 50;
const MOBILE_QUERY = "(max-width: 640px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => setIsMobile(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

function chunk(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages.length > 0 ? pages : [[]];
}

export default function ShopCarousel({ shops, renderExtra }) {
  const [pageIndex, setPageIndex] = useState(0);
  const dragState = useRef(null);
  const shopsKey = shops.map((shop) => shop.id).join(",");
  const isMobile = useIsMobile();

  useEffect(() => {
    setPageIndex(0);
  }, [shopsKey]);

  if (shops.length === 0) {
    return <EmptyState text="No coffee shops match your search yet." />;
  }

  if (isMobile) {
    return (
      <ul className="shop-list shop-carousel__mobile-scroll">
        {shops.map((shop, index) => (
          <ShopCard key={shop.id} shop={shop} index={index} extra={renderExtra ? renderExtra(shop) : null} />
        ))}
      </ul>
    );
  }

  const pages = chunk(shops, PAGE_SIZE);
  const clampedIndex = Math.min(pageIndex, pages.length - 1);

  function goTo(index) {
    setPageIndex(Math.max(0, Math.min(pages.length - 1, index)));
  }

  function handlePointerDown(event) {
    dragState.current = { startX: event.clientX };
  }

  function handlePointerUp(event) {
    if (!dragState.current) {
      return;
    }

    const deltaX = event.clientX - dragState.current.startX;
    dragState.current = null;

    if (deltaX <= -SWIPE_THRESHOLD_PX) {
      goTo(clampedIndex + 1);
    } else if (deltaX >= SWIPE_THRESHOLD_PX) {
      goTo(clampedIndex - 1);
    }
  }

  return (
    <div className="shop-carousel">
      <div
        className="shop-carousel__viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragState.current = null;
        }}
      >
        <div
          className="shop-carousel__track"
          style={{
            width: `${pages.length * 100}%`,
            transform: `translateX(-${(100 / pages.length) * clampedIndex}%)`
          }}
        >
          {pages.map((page, index) => (
            <ul className="shop-list shop-carousel__page" key={index} style={{ width: `${100 / pages.length}%` }}>
              {page.map((shop, shopIndex) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  index={shopIndex}
                  extra={renderExtra ? renderExtra(shop) : null}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>

      {pages.length > 1 ? (
        <div className="shop-carousel__controls">
          <button
            type="button"
            className="shop-carousel__arrow"
            onClick={() => goTo(clampedIndex - 1)}
            disabled={clampedIndex === 0}
            aria-label="Previous shops"
          >
            &lsaquo;
          </button>
          <div className="shop-carousel__dots">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`shop-carousel__dot${index === clampedIndex ? " shop-carousel__dot--active" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="shop-carousel__arrow"
            onClick={() => goTo(clampedIndex + 1)}
            disabled={clampedIndex === pages.length - 1}
            aria-label="Next shops"
          >
            &rsaquo;
          </button>
        </div>
      ) : null}
    </div>
  );
}
