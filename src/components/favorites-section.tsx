"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { projects } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export function FavoritesSection() {
  const { favorites, isLoaded, removeFavorite } = useFavorites();

  // Get favorite projects
  const favoriteProjects = projects.filter((p) => favorites.includes(p.id));

  if (!isLoaded) {
    return (
      <Card className="border-l-4 border-l-yellow-400">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-yellow-400">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            Favorites
          </span>
          <Badge variant="secondary">{favoriteProjects.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {favoriteProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No favorites yet. Click the star icon on any project to add it here.
          </p>
        ) : (
          favoriteProjects.slice(0, 10).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm hover:bg-muted p-1 rounded group"
            >
              <Link
                href={`/projects/${p.id}`}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <span className="truncate">{p.projectName}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 flex-shrink-0" />
              </Link>
              <button
                onClick={() => removeFavorite(p.id)}
                className="p-1 hover:bg-muted-foreground/20 rounded opacity-0 group-hover:opacity-100"
                title="Remove from favorites"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
        {favoriteProjects.length > 10 && (
          <Link
            href="/projects"
            className="text-xs text-primary hover:underline block mt-2"
          >
            View all {favoriteProjects.length} favorites →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
