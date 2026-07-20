const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Best-effort geocoding using OpenStreetMap's free Nominatim service.
// Returns null instead of throwing so shop creation never fails just
// because a coordinate lookup didn't succeed.
export async function geocodeAddress(address, city, state) {
  const query = [address, city, state].filter(Boolean).join(", ");

  if (!query) {
    return null;
  }

  try {
    const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "wheres-my-coffee-student-project" }
    });

    if (!response.ok) {
      return null;
    }

    const results = await response.json();

    if (!results.length) {
      return null;
    }

    return { latitude: Number(results[0].lat), longitude: Number(results[0].lon) };
  } catch {
    return null;
  }
}
