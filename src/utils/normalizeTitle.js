const IMAGE_BASE =
  process.env.REACT_APP_TMDB_IMAGE_BASE?.trim() || "https://image.tmdb.org/t/p/w500";

export function normalizeTitle(raw, genreMap) {
  if (!raw || typeof raw !== "object") return null;

  const mediaType = raw.media_type || (raw.title ? "movie" : "tv");
  if (mediaType === "person") return null;

  const id = raw.id != null ? String(raw.id) : null;
  if (!id) return null;

  const key = `${mediaType}:${id}`;

  const title =
    raw.title ||
    raw.name ||
    raw.original_title ||
    raw.original_name ||
    "Untitled";

  const date = raw.release_date || raw.first_air_date || "";
  const year = date && date.length >= 4 ? Number(date.slice(0, 4)) : null;

  const rating = typeof raw.vote_average === "number" ? raw.vote_average : null;

  const imageUrl = raw.poster_path ? `${IMAGE_BASE}${raw.poster_path}` : "";

  const genreIds = Array.isArray(raw.genre_ids) ? raw.genre_ids : [];
  const genres =
    genreMap && genreIds.length
      ? genreIds.map((gid) => genreMap.get(gid)).filter(Boolean)
      : [];

  return {
    key,       // <— ВАЖНО
    id,
    mediaType, // "movie" | "tv"
    title,
    year,
    rating,
    imageUrl,
    genres,
    overview: raw.overview || "",
    _raw: raw,
  };
}
