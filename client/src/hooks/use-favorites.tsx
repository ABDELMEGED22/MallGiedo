import { useState, useEffect } from "react";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavoriteIds(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds(current => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favoriteIds.includes(productId);
  };

  const getFavoriteCount = () => {
    return favoriteIds.length;
  };

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
  };
}
