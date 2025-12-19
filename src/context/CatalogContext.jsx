import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getJSON, setJSON } from "../utils/storage";

const FAVORITES_KEY = "imdb_favorites_v1";
const RATINGS_KEY = "imdb_ratings_v1";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getJSON(FAVORITES_KEY, []));
  const [ratings, setRatings] = useState(() => getJSON(RATINGS_KEY, {}));

  useEffect(() => {
    setJSON(FAVORITES_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    setJSON(RATINGS_KEY, ratings);
  }, [ratings]);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = (id) => {
    if (!id) return;
    setFavorites((prev) => {
      const has = prev.includes(id);
      if (has) return prev.filter((x) => x !== id);
      return [id, ...prev];
    });
  };

  const isFavorite = (id) => favoritesSet.has(id);

  const getRating = (id) => {
    if (!id) return 0;
    const v = ratings[id];
    return typeof v === "number" ? v : 0;
  };

  const setRating = (id, value) => {
    if (!id) return;
    const v = Number(value);
    if (!Number.isFinite(v)) return;

    // 0 = remove rating
    if (v <= 0) {
      setRatings((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    const clamped = Math.max(1, Math.min(10, Math.round(v)));
    setRatings((prev) => ({ ...prev, [id]: clamped }));
  };

  const value = {
    favorites,
    ratings,
    toggleFavorite,
    isFavorite,
    getRating,
    setRating,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
