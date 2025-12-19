import { tmdbClient } from "./tmdbClient";
import { getGenresMap } from "./genresApi";
import { normalizeTitle } from "../utils/normalizeTitle";

export async function discoverTitles({ mediaType, page = 1, genreIds = [], year = null }) {
  const genreMap = await getGenresMap();

  const endpoint = mediaType === "tv" ? "/discover/tv" : "/discover/movie";

  const params = {
    page,
    include_adult: false,
    sort_by: "popularity.desc",
  };

  if (genreIds?.length) params.with_genres = genreIds.join(",");

  if (year) {
    if (mediaType === "tv") params.first_air_date_year = year;
    else params.primary_release_year = year;
  }

  const res = await tmdbClient.get(endpoint, { params });

  const payload = res.data || {};
  const rawItems = Array.isArray(payload.results) ? payload.results : [];

  const items = rawItems.map((x) => normalizeTitle(x, genreMap)).filter(Boolean);

  return {
    items,
    page: payload.page || page,
    totalPages: payload.total_pages || 1,
  };
}
