"use client";

import { useState, useEffect, useRef } from "react";
import { projects } from "@/lib/data";
import { allDeals } from "@/lib/deals";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, FolderKanban, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number | string;
  type: "project" | "deal";
  title: string;
  subtitle: string | null;
  href: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const projectResults: SearchResult[] = [];
    const dealResults: SearchResult[] = [];

    // Search projects
    projects.forEach((p) => {
      if (
        p.projectName.toLowerCase().includes(searchLower) ||
        p.customer?.toLowerCase().includes(searchLower) ||
        p.location?.toLowerCase().includes(searchLower)
      ) {
        projectResults.push({
          id: p.id,
          type: "project",
          title: p.projectName,
          subtitle: p.customer || p.location || null,
          href: `/projects/${p.id}`,
        });
      }
    });

    // Search deals
    allDeals.forEach((d) => {
      if (
        d.name.toLowerCase().includes(searchLower) ||
        d.contact?.toLowerCase().includes(searchLower) ||
        d.notes?.toLowerCase().includes(searchLower)
      ) {
        dealResults.push({
          id: d.id,
          type: "deal",
          title: d.name,
          subtitle: d.contact || d.notes || null,
          href: d.matchedProjectId ? `/projects/${d.matchedProjectId}` : "/sheet",
        });
      }
    });

    // Combine and limit results
    setResults([...projectResults.slice(0, 5), ...dealResults.slice(0, 3)]);
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      setQuery("");
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setQuery("");
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search projects, deals, customers..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer ${
                  index === selectedIndex ? "bg-muted" : ""
                }`}
              >
                {result.type === "project" ? (
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {result.type === "project" ? "Project" : "Deal"}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
