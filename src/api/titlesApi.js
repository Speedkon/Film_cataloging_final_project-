import { tmdbClient } from "./tmdbClient";
import { getGenresMap } from "./genresApi";
import { normalizeTitle } from "../utils/normalizeTitle";

export async function fetchHomeTitles({ query, page = 1 }) {
  const genreMap = await getGenresMap();

  const q = (query || "").trim();

  const res = q
    ? await tmdbClient.get("/search/multi", {
        params: { query: q, page, include_adult: false },
      })
    : await tmdbClient.get("/trending/all/week", { params: { page } });

  const payload = res.data || {};
  const rawItems = Array.isArray(payload.results) ? payload.results : [];

  const items = rawItems
    .map((x) => normalizeTitle(x, genreMap))
    .filter(Boolean)
    .filter((x) => x.id && x.mediaType !== "person");

  return {
    items,
    page: payload.page || page,
    totalPages: payload.total_pages || 1,
  };
}
