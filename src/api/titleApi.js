import { tmdbClient } from "./tmdbClient";

const IMAGE_BASE =
  process.env.REACT_APP_TMDB_IMAGE_BASE?.trim() || "https://image.tmdb.org/t/p/w500";

// простейший in-memory cache, чтобы не дергать одно и то же
const cardCache = new Map();
const detailsCache = new Map();

function buildCardFromDetails(details, mediaType) {
  const id = String(details.id);
  const key = `${mediaType}:${id}`;

  const title =
    mediaType === "movie"
      ? details.title || details.original_title || "Untitled"
      : details.name || details.original_name || "Untitled";

  const date =
    mediaType === "movie" ? details.release_date : details.first_air_date;

  const year = date && date.length >= 4 ? Number(date.slice(0, 4)) : null;

  const rating =
    typeof details.vote_average === "number" ? details.vote_average : null;

  const imageUrl = details.poster_path ? `${IMAGE_BASE}${details.poster_path}` : "";

  const genres = Array.isArray(details.genres) ? details.genres.map((g) => g.name).filter(Boolean) : [];

  return { key, id, mediaType, title, year, rating, imageUrl, genres, overview: details.overview || "" };
}

export async function getTitleCardData(mediaType, id) {
  const key = `${mediaType}:${id}`;
  if (cardCache.has(key)) return cardCache.get(key);

  const res = await tmdbClient.get(`/${mediaType}/${id}`);
  const card = buildCardFromDetails(res.data, mediaType);
  cardCache.set(key, card);
  return card;
}

export async function getTitleDetailsWithCredits(mediaType, id) {
  const cacheKey = `${mediaType}:${id}`;
  if (detailsCache.has(cacheKey)) return detailsCache.get(cacheKey);

  const [detailsRes, creditsRes] = await Promise.all([
    tmdbClient.get(`/${mediaType}/${id}`),
    tmdbClient.get(`/${mediaType}/${id}/credits`),
  ]);

  const details = detailsRes.data || {};
  const credits = creditsRes.data || {};

  const result = {
    mediaType,
    id: String(details.id),
    title:
      mediaType === "movie"
        ? details.title || details.original_title || "Untitled"
        : details.name || details.original_name || "Untitled",
    posterUrl: details.poster_path ? `${IMAGE_BASE}${details.poster_path}` : "",
    overview: details.overview || "",
    genres: Array.isArray(details.genres) ? details.genres.map((g) => g.name).filter(Boolean) : [],
    year: (() => {
      const date = mediaType === "movie" ? details.release_date : details.first_air_date;
      return date && date.length >= 4 ? Number(date.slice(0, 4)) : null;
    })(),
    rating: typeof details.vote_average === "number" ? details.vote_average : null,

    // movie fields
    runtime: mediaType === "movie" ? details.runtime || null : null,

    // tv fields
    seasons: mediaType === "tv" ? details.number_of_seasons || null : null,
    episodes: mediaType === "tv" ? details.number_of_episodes || null : null,

    // cast text
    cast: Array.isArray(credits.cast) ? credits.cast : [],
  };

  detailsCache.set(cacheKey, result);
  return result;
}
