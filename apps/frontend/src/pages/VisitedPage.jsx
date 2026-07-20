import { useEffect, useState } from "react";
import { addFavorite, fetchFavorites, removeFavorite, setVisited as setVisitedApi } from "../api/favorites.js";
import { useAuth } from "../context/AuthContext.jsx";
import ShopList from "../components/ShopList.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import VisitedToggle from "../components/VisitedToggle.jsx";
import ShopListSkeleton from "../components/ShopListSkeleton.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function VisitedPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyShopId, setBusyShopId] = useState(null);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const { data } = await fetchFavorites(token);
        setFavorites(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [token]);

  async function handleToggleFavorite(shopId, favorite) {
    setBusyShopId(shopId);

    try {
      if (favorite.saved) {
        await removeFavorite(shopId, token);
        setFavorites((current) => current.map((item) => (item.shopId === shopId ? { ...item, saved: false } : item)));
      } else {
        await addFavorite(shopId, token);
        setFavorites((current) => current.map((item) => (item.shopId === shopId ? { ...item, saved: true } : item)));
      }
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setBusyShopId(null);
    }
  }

  async function handleToggleVisited(shopId, favorite) {
    setBusyShopId(shopId);

    try {
      const nextVisited = !favorite.visited;
      await setVisitedApi(shopId, nextVisited, token);
      setFavorites((current) =>
        nextVisited || favorite.saved
          ? current.map((item) => (item.shopId === shopId ? { ...item, visited: nextVisited } : item))
          : current.filter((item) => item.shopId !== shopId)
      );
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setBusyShopId(null);
    }
  }

  if (loading) {
    return (
      <section className="panel panel--section-opacity">
        <h1>Shops you've visited</h1>
        <ShopListSkeleton />
      </section>
    );
  }

  if (error) {
    return <ErrorMessage text={error} />;
  }

  const visited = favorites.filter((favorite) => favorite.visited);

  if (visited.length === 0) {
    return <EmptyState text="You haven't marked any shops as visited yet." />;
  }

  const shops = visited.map((favorite) => favorite.shop);

  function renderExtra(shop) {
    const favorite = favorites.find((item) => item.shopId === shop.id);
    const busy = busyShopId === shop.id;

    return (
      <div className="shop-card__save-actions">
        <FavoriteButton
          isFavorite={favorite.saved}
          onToggle={() => handleToggleFavorite(shop.id, favorite)}
          disabled={busy}
        />
        <VisitedToggle
          visited={favorite.visited}
          onToggle={() => handleToggleVisited(shop.id, favorite)}
          disabled={busy}
        />
      </div>
    );
  }

  return (
    <section className="panel panel--section-opacity">
      <h1>Shops you've visited</h1>
      <ShopList shops={shops} renderExtra={renderExtra} />
    </section>
  );
}
