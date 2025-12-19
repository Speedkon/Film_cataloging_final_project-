import { tmdbClient } from "./tmdbClient";

let cached = null;

export async function getGenresMap() {
  if (cached) return cached;

  const [movieRes, tvRes] = await Promise.all([
    tmdbClient.get("/genre/movie/list"),
    tmdbClient.get("/genre/tv/list"),
  ]);

  const map = new Map();

  const add = (arr) => {
    (arr || []).forEach((g) => {
      if (g && typeof g.id === "number" && g.name) map.set(g.id, g.name);
    });
  };

  add(movieRes.data?.genres);
  add(tvRes.data?.genres);

  cached = map;
  return cached;
}
