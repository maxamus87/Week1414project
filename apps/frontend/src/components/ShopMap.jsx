import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import EmptyState from "./EmptyState.jsx";

const pinIcon = L.divIcon({
  className: "shop-pin",
  html: `<span class="marker-drop-inner"><svg viewBox="0 0 24 32" width="30" height="38">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="currentColor" />
      <circle cx="12" cy="12" r="5" fill="var(--color-surface, #fff)" />
    </svg></span>`,
  iconSize: [30, 38],
  iconAnchor: [15, 38],
  popupAnchor: [0, -34]
});

const youAreHereIcon = L.divIcon({
  className: "you-are-here-pin",
  html: `<span class="marker-drop-inner"><svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.25" />
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="var(--color-surface, #fff)" stroke-width="2" />
    </svg></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function FitToPoints({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 13);
    } else if (points.length > 1) {
      map.fitBounds(points.map((point) => [point.latitude, point.longitude]), { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
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
      <MapContainer
        center={[boundsPoints[0].latitude, boundsPoints[0].longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPoints points={boundsPoints} />
        {userLocation ? (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={youAreHereIcon}>
            <Popup>You are here</Popup>
          </Marker>
        ) : null}
        {shopPoints.map((shop) => (
          <Marker key={shop.id} position={[shop.latitude, shop.longitude]} icon={pinIcon}>
            <Popup>
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
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
