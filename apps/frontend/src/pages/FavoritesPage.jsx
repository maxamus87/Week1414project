import { useEffect, useState } from "react";
import { fetchFavorites } from "../api/favorites.js";
import { useAuth } from "../context/AuthContext.jsx";
import ShopList from "../components/ShopList.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <LoadingMessage text="Loading favorites..." />;
  }

  if (error) {
    return <ErrorMessage text={error} />;
  }

  if (favorites.length === 0) {
    return <EmptyState text="You haven't favorited any shops yet." />;
  }

  const shops = favorites.map((favorite) => favorite.shop);

  return (
    <section className="panel">
      <h1>Your favorite shops</h1>
      <ShopList shops={shops} />
    </section>
  );
}
