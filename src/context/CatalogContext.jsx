import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getJSON, setJSON } from "../utils/storage";

const FAVORITES_KEY = "tmdb_favorites_v1";
const RATINGS_KEY = "tmdb_ratings_v1";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getJSON(FAVORITES_KEY, [])); // array of "movie:123"
  const [ratings, setRatings] = useState(() => getJSON(RATINGS_KEY, {})); // { "movie:123": 8 }

  useEffect(() => setJSON(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => setJSON(RATINGS_KEY, ratings), [ratings]);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = (key) => {
    if (!key) return;
    setFavorites((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [key, ...prev]));
  };

  const isFavorite = (key) => favoritesSet.has(key);

  const getRating = (key) => {
    if (!key) return 0;
    const v = ratings[key];
    return typeof v === "number" ? v : 0;
  };

  const setRating = (key, value) => {
    if (!key) return;
    const v = Number(value);
    if (!Number.isFinite(v)) return;

    if (v <= 0) {
      setRatings((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    const clamped = Math.max(1, Math.min(10, Math.round(v)));
    setRatings((prev) => ({ ...prev, [key]: clamped }));
  };

  const value = { favorites, ratings, toggleFavorite, isFavorite, getRating, setRating };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
