import { useEffect, useState } from "react";
import { fetchShops } from "../api/shops.js";
import { geocodeAddress } from "../api/geocode.js";
import { addFavorite, fetchFavorites, removeFavorite, setVisited as setVisitedApi } from "../api/favorites.js";
import { milesBetween } from "../utils/distance.js";
import { useAuth } from "../context/AuthContext.jsx";
import ShopCarousel from "../components/ShopCarousel.jsx";
import ShopMap from "../components/ShopMap.jsx";
import SearchFilterBar from "../components/SearchFilterBar.jsx";
import ShopListSkeleton from "../components/ShopListSkeleton.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import VisitedToggle from "../components/VisitedToggle.jsx";

export default function HomePage() {
  const { token } = useAuth();
  const [shops, setShops] = useState([]);
  const [filters, setFilters] = useState({ search: "", city: "", state: "", sort: "name" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [radiusMiles, setRadiusMiles] = useState("");

  const [favoritesByShopId, setFavoritesByShopId] = useState({});
  const [favoriteBusyShopId, setFavoriteBusyShopId] = useState(null);

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShops() {
      setLoading(true);
      setError("");

      try {
        const { data } = await fetchShops(filters);
        if (!cancelled) {
          setShops(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(loadShops, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (!token) {
        setFavoritesByShopId({});
        return;
      }

      try {
        const { data } = await fetchFavorites(token);
        if (!cancelled) {
          setFavoritesByShopId(Object.fromEntries(data.map((favorite) => [favorite.shopId, favorite])));
        }
      } catch {
        if (!cancelled) {
          setFavoritesByShopId({});
        }
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleToggleFavorite(shopId) {
    setFavoriteBusyShopId(shopId);
    const existing = favoritesByShopId[shopId];

    try {
      if (existing?.saved) {
        await removeFavorite(shopId, token);
        setFavoritesByShopId((current) => {
          const next = { ...current };
          if (current[shopId]?.visited) {
            next[shopId] = { ...current[shopId], saved: false };
          } else {
            delete next[shopId];
          }
          return next;
        });
      } else {
        const { data } = await addFavorite(shopId, token);
        setFavoritesByShopId((current) => ({ ...current, [shopId]: data }));
      }
    } catch (favoriteError) {
      setError(favoriteError.message);
    } finally {
      setFavoriteBusyShopId(null);
    }
  }

  async function handleToggleVisited(shopId) {
    const existing = favoritesByShopId[shopId];
    const nextVisited = !existing?.visited;
    setFavoriteBusyShopId(shopId);

    try {
      const { data } = await setVisitedApi(shopId, nextVisited, token);
      setFavoritesByShopId((current) => {
        if (!nextVisited && !data.saved) {
          const next = { ...current };
          delete next[shopId];
          return next;
        }
        return { ...current, [shopId]: data };
      });
    } catch (visitedError) {
      setError(visitedError.message);
    } finally {
      setFavoriteBusyShopId(null);
    }
  }

  function renderShopExtra(shop) {
    if (!token) {
      return null;
    }

    const favorite = favoritesByShopId[shop.id];
    const busy = favoriteBusyShopId === shop.id;

    return (
      <div className="shop-card__save-actions">
        <FavoriteButton
          isFavorite={Boolean(favorite?.saved)}
          onToggle={() => handleToggleFavorite(shop.id)}
          disabled={busy}
        />
        <VisitedToggle
          visited={Boolean(favorite?.visited)}
          onToggle={() => handleToggleVisited(shop.id)}
          disabled={busy}
        />
      </div>
    );
  }

  async function handleFindNear(addressText) {
    setLocationBusy(true);
    setLocationError("");

    try {
      const { data } = await geocodeAddress(addressText);
      setUserLocation({ ...data, label: addressText });
    } catch (geocodeError) {
      setLocationError(geocodeError.message);
    } finally {
      setLocationBusy(false);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support geolocation.");
      return;
    }

    setLocationBusy(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "your current location"
        });
        setLocationBusy(false);
      },
      () => {
        setLocationError("Couldn't get your location. Check your browser's location permission.");
        setLocationBusy(false);
      },
      { timeout: 10000 }
    );
  }

  function handleClearLocation() {
    setUserLocation(null);
    setLocationError("");
    setRadiusMiles("");
    if (filters.sort === "nearest") {
      setFilters((current) => ({ ...current, sort: "name" }));
    }
  }

  const shopsWithDistance = userLocation
    ? shops.map((shop) => ({
        ...shop,
        distance:
          shop.latitude != null && shop.longitude != null ? milesBetween(userLocation, shop) : null
      }))
    : shops;

  const radiusFilteredShops =
    userLocation && radiusMiles
      ? shopsWithDistance.filter((shop) => shop.distance != null && shop.distance <= Number(radiusMiles))
      : shopsWithDistance;

  const displayedShops =
    userLocation && filters.sort === "nearest"
      ? [...radiusFilteredShops].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
      : radiusFilteredShops;


  return (
    <>
      <section className={`section-band${showMap ? " section-band--flush" : ""}`}>
        <div className="section-band__inner home-hero section-band__inner--tight-bottom section-band__inner--pad-top-sm">
          <div className="home-hero__title">
            <h1>Find your local coffee shop</h1>
            <p>Search, filter, and rate independent coffee shops near you.</p>
          </div>
          <div className="home-hero__search">
            <SearchFilterBar
              filters={filters}
              onChange={setFilters}
              onFindNear={handleFindNear}
              onUseLocation={handleUseLocation}
              locationLabel={
                userLocation
                  ? `Showing distance from ${userLocation.label}${radiusMiles ? ` · within ${radiusMiles} mi` : ""}`
                  : ""
              }
              locationBusy={locationBusy}
              locationError={locationError}
              onClearLocation={handleClearLocation}
              hasLocation={Boolean(userLocation)}
              radiusMiles={radiusMiles}
              onRadiusChange={setRadiusMiles}
            />
          </div>
        </div>
        <div className="section-band__inner section-band__inner--tight-top section-band__inner--pad-bottom-xs">
          <button type="button" className="map-toggle" onClick={() => setShowMap((current) => !current)}>
            {showMap ? "Hide map" : "Show map"}
          </button>
        </div>
      </section>

      {showMap ? (
        <section className="section-band section-band--full">
          <ShopMap shops={displayedShops} userLocation={userLocation} />
        </section>
      ) : null}

      {error ? (
        <section className="section-band">
          <div className="section-band__inner">
            <ErrorMessage text={error} />
          </div>
        </section>
      ) : null}

      {loading ? (
        <section className="section-band">
          <div className="section-band__inner">
            <ShopListSkeleton />
          </div>
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="section-band">
          <div className="section-band__inner">
            <ShopCarousel shops={displayedShops} renderExtra={renderShopExtra} />
          </div>
        </section>
      ) : null}
    </>
  );
}
