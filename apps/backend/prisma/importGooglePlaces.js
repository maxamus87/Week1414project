import "dotenv/config";
import prisma from "../server/db/prisma.js";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SEARCH_QUERY = process.env.PLACES_IMPORT_QUERY || "coffee shop in Central Ohio";
const IMPORT_USER_EMAIL = "places-import@system.local";
const FIELD_MASK = "places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents";
const MAX_PAGES = 3;
const PAGE_TOKEN_DELAY_MS = 2_000;

if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is required to run this import.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractAddressPart(addressComponents, type) {
  const component = addressComponents?.find((part) => part.types?.includes(type));
  return component?.shortText || component?.longText || null;
}

async function fetchPlacesPage(pageToken) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": `${FIELD_MASK},nextPageToken`
    },
    body: JSON.stringify(
      pageToken ? { textQuery: SEARCH_QUERY, pageToken } : { textQuery: SEARCH_QUERY, pageSize: 20 }
    )
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Places API request failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

async function fetchAllPlaces() {
  const places = [];
  let pageToken;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    if (pageToken) {
      await sleep(PAGE_TOKEN_DELAY_MS);
    }

    const result = await fetchPlacesPage(pageToken);
    places.push(...(result.places || []));

    if (!result.nextPageToken) {
      break;
    }

    pageToken = result.nextPageToken;
  }

  return places;
}

async function getImportUser() {
  return prisma.user.upsert({
    where: { email: IMPORT_USER_EMAIL },
    update: {},
    create: {
      email: IMPORT_USER_EMAIL,
      name: "Google Places Import",
      passwordHash: "not-a-real-account"
    }
  });
}

async function main() {
  const importUser = await getImportUser();
  const places = await fetchAllPlaces();

  let created = 0;
  let updated = 0;

  for (const place of places) {
    const city = extractAddressPart(place.addressComponents, "locality") || "Unknown";
    const state = extractAddressPart(place.addressComponents, "administrative_area_level_1") || "OH";

    const data = {
      name: place.displayName?.text || "Unnamed coffee shop",
      address: place.formattedAddress || null,
      city,
      state,
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null
    };

    const existing = await prisma.shop.findUnique({ where: { placeId: place.id } });

    await prisma.shop.upsert({
      where: { placeId: place.id },
      update: data,
      create: { ...data, placeId: place.id, createdBy: importUser.id }
    });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  console.log(`Fetched ${places.length} places for query "${SEARCH_QUERY}".`);
  console.log(`Created ${created} shops, updated ${updated} shops.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
