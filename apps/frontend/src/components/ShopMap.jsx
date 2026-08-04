import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useMap
} from "@vis.gl/react-google-maps";
import EmptyState from "./EmptyState.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function FitToPoints({ points }) {
  const map = useMap();
  const lastKeyRef = useRef(null);
  const key = points.map((point) => `${point.latitude},${point.longitude}`).join("|");

  useEffect(() => {
    if (!map || key === lastKeyRef.current) {
      return;
    }

    lastKeyRef.current = key;

    if (points.length === 1) {
      map.setCenter({ lat: points[0].latitude, lng: points[0].longitude });
      map.setZoom(13);
    } else if (points.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend({ lat: point.latitude, lng: point.longitude }));
      map.fitBounds(bounds, 40);
    }
  }, [key, map, points]);

  return null;
}

// Matches the .map-reveal CSS transition duration in styles.css, so the
// container has finished expanding (and Google Maps has a real size to
// pan/zoom against) before we move the camera.
const MAP_REVEAL_MS = 400;

function FocusOnShop({ focusShop, shops }) {
  const map = useMap();
  const lastTokenRef = useRef(null);
  const shopsRef = useRef(shops);
  shopsRef.current = shops;

  useEffect(() => {
    if (!map || !focusShop || focusShop.token === lastTokenRef.current) {
      return;
    }

    lastTokenRef.current = focusShop.token;

    const timer = setTimeout(() => {
      const shop = shopsRef.current.find((candidate) => candidate.id === focusShop.id);
      if (!shop) {
        return;
      }

      window.google.maps.event.trigger(map, "resize");
      map.panTo({ lat: shop.latitude, lng: shop.longitude });
      map.setZoom(16);
    }, MAP_REVEAL_MS + 50);

    return () => clearTimeout(timer);
    // shops is read from shopsRef, not a dependency here on purpose: it gets
    // a new array identity on every ShopMap render, which would otherwise
    // cancel the pending timer before it fires.
  }, [focusShop, map]);

  return null;
}

function ShopMarker({ shop, isOpen, onSelect, onClose }) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: shop.latitude, lng: shop.longitude }}
        onClick={() => onSelect(shop.id)}
      >
        <Pin background="var(--color-accent)" borderColor="var(--color-accent-contrast)" glyphColor="var(--color-accent-contrast)" />
      </AdvancedMarker>
      {isOpen ? (
        <InfoWindow anchor={marker} onCloseClick={onClose} headerDisabled maxWidth={200}>
          <div className="shop-map-popup">
            <strong>{shop.name}</strong>
            <br />
            {shop.city}
            {shop.distance != null ? (
              <>
                <br />
                {shop.distance.toFixed(1)} mi away
              </>
            ) : null}
            <br />
            <Link to={`/shops/${shop.id}`}>View shop</Link>
          </div>
        </InfoWindow>
      ) : null}
    </>
  );
}

export default function ShopMap({ shops, userLocation, focusShop }) {
  const [activeShopId, setActiveShopId] = useState(null);
  const shopPoints = shops.filter((shop) => shop.latitude != null && shop.longitude != null);
  const boundsPoints = userLocation ? [...shopPoints, userLocation] : shopPoints;

  useEffect(() => {
    if (focusShop) {
      setActiveShopId(focusShop.id);
    }
  }, [focusShop]);

  if (boundsPoints.length === 0) {
    return (
      <div className="shop-map shop-map--empty">
        <EmptyState text="No shop locations to show on the map yet." />
      </div>
    );
  }

  return (
    <div className="shop-map">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="shop-map"
          defaultCenter={{ lat: boundsPoints[0].latitude, lng: boundsPoints[0].longitude }}
          defaultZoom={13}
          scrollwheel
          disableDefaultUI
          zoomControl
          onClick={() => setActiveShopId(null)}
        >
          <FitToPoints points={boundsPoints} />
          <FocusOnShop focusShop={focusShop} shops={shopPoints} />
          {userLocation ? (
            <AdvancedMarker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
              <Pin background="var(--color-surface)" borderColor="var(--color-accent)" glyphColor="var(--color-accent)" />
            </AdvancedMarker>
          ) : null}
          {shopPoints.map((shop) => (
            <ShopMarker
              key={shop.id}
              shop={shop}
              isOpen={activeShopId === shop.id}
              onSelect={setActiveShopId}
              onClose={() => setActiveShopId(null)}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
