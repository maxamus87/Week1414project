import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchShop, deleteShop } from "../api/shops.js";
import { createReview, deleteReview } from "../api/reviews.js";
import { addFavorite, fetchFavorites, removeFavorite, setVisited as setVisitedApi } from "../api/favorites.js";
import { useAuth } from "../context/AuthContext.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import VisitedToggle from "../components/VisitedToggle.jsx";
import ShopDetailSkeleton from "../components/ShopDetailSkeleton.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import StarRating from "../components/StarRating.jsx";

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [isVisited, setIsVisited] = useState(false);
  const [visitedBusy, setVisitedBusy] = useState(false);

  const loadShop = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await fetchShop(id);
      setShop(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  useEffect(() => {
    async function loadFavoriteStatus() {
      if (!token) {
        setIsFavorite(false);
        setIsVisited(false);
        return;
      }

      try {
        const { data } = await fetchFavorites(token);
        const favorite = data.find((item) => item.shopId === Number(id));
        setIsFavorite(Boolean(favorite?.saved));
        setIsVisited(Boolean(favorite?.visited));
      } catch {
        setIsFavorite(false);
        setIsVisited(false);
      }
    }

    loadFavoriteStatus();
  }, [token, id]);

  async function handleToggleFavorite() {
    setFavoriteBusy(true);

    try {
      if (isFavorite) {
        await removeFavorite(id, token);
      } else {
        await addFavorite(id, token);
      }
      setIsFavorite((current) => !current);
    } catch (favoriteError) {
      setError(favoriteError.message);
    } finally {
      setFavoriteBusy(false);
    }
  }

  async function handleToggleVisited() {
    setVisitedBusy(true);

    try {
      await setVisitedApi(id, !isVisited, token);
      setIsVisited((current) => !current);
    } catch (visitedError) {
      setError(visitedError.message);
    } finally {
      setVisitedBusy(false);
    }
  }

  async function handleAddReview(review) {
    await createReview(id, review, token);
    await loadShop();
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await deleteReview(reviewId, token);
      await loadShop();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function handleDeleteShop() {
    if (!window.confirm("Delete this shop? This cannot be undone.")) {
      return;
    }

    try {
      await deleteShop(id, token);
      navigate("/");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  if (loading) {
    return <ShopDetailSkeleton />;
  }

  if (error && !shop) {
    return <ErrorMessage text={error} />;
  }

  if (!shop) {
    return null;
  }

  const isOwner = user && user.id === shop.createdBy;

  return (
    <section className="panel">
      <div className="shop-detail__header">
        <div>
          <h1>{shop.name}</h1>
          <p className="shop-card__city">{shop.city}, {shop.state}{shop.address ? ` · ${shop.address}` : ""}</p>
        </div>
        {shop.averageRating ? (
          <span className="shop-card__rating">
            <StarRating rating={shop.averageRating} size={16} />
            {shop.averageRating.toFixed(1)} ({shop.reviewCount})
          </span>
        ) : (
          <span className="shop-card__rating shop-card__rating--empty">No ratings yet</span>
        )}
      </div>

      {shop.description ? <p>{shop.description}</p> : null}
      {shop.website ? (
        <p className="shop-detail__website">
          <a href={shop.website} target="_blank" rel="noreferrer">
            {shop.website}
          </a>
        </p>
      ) : null}

      <ErrorMessage text={error} />

      <div className="shop-detail__actions">
        {user ? (
          <div className="shop-detail__save-actions">
            <FavoriteButton isFavorite={isFavorite} onToggle={handleToggleFavorite} disabled={favoriteBusy} />
            <VisitedToggle visited={isVisited} onToggle={handleToggleVisited} disabled={visitedBusy} />
          </div>
        ) : (
          <p className="status">
            <Link to="/login">Log in</Link> to save favorites and leave reviews.
          </p>
        )}

        {isOwner ? (
          <div className="shop-detail__owner-actions">
            <Link to={`/shops/${shop.id}/edit`}>Edit shop</Link>
            <button type="button" onClick={handleDeleteShop} className="danger-button">
              Delete shop
            </button>
          </div>
        ) : null}
      </div>

      <h2>Reviews</h2>
      {user ? <ReviewForm onSubmit={handleAddReview} /> : null}
      <ReviewList reviews={shop.reviews} onDelete={handleDeleteReview} />
    </section>
  );
}
