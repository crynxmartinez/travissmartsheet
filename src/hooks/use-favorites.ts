"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "smartsheet-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    }
  }, [favorites, isLoaded]);

  // Check if a project is favorited
  const isFavorite = useCallback(
    (projectId: number) => favorites.includes(projectId),
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback((projectId: number) => {
    setFavorites((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  }, []);

  // Add to favorites
  const addFavorite = useCallback((projectId: number) => {
    setFavorites((prev) => {
      if (prev.includes(projectId)) return prev;
      return [...prev, projectId];
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((projectId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== projectId));
  }, []);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isLoaded,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
