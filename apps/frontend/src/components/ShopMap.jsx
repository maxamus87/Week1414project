import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!map) {
      return;
    }

    if (points.length === 1) {
      map.setCenter({ lat: points[0].latitude, lng: points[0].longitude });
      map.setZoom(13);
    } else if (points.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend({ lat: point.latitude, lng: point.longitude }));
      map.fitBounds(bounds, 40);
    }
  }, [points, map]);

  return null;
}

function ShopMarker({ shop }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: shop.latitude, lng: shop.longitude }}
        onClick={() => setOpen(true)}
      >
        <Pin background="var(--color-accent)" borderColor="var(--color-accent-contrast)" glyphColor="var(--color-accent-contrast)" />
      </AdvancedMarker>
      {open ? (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)} headerDisabled>
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

export default function ShopMap({ shops, userLocation }) {
  const shopPoints = shops.filter((shop) => shop.latitude != null && shop.longitude != null);
  const boundsPoints = userLocation ? [...shopPoints, userLocation] : shopPoints;

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
          scrollwheel={false}
          disableDefaultUI
          zoomControl
        >
          <FitToPoints points={boundsPoints} />
          {userLocation ? (
            <AdvancedMarker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
              <Pin background="var(--color-surface)" borderColor="var(--color-accent)" glyphColor="var(--color-accent)" />
            </AdvancedMarker>
          ) : null}
          {shopPoints.map((shop) => (
            <ShopMarker key={shop.id} shop={shop} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
