import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "@components/layout/AppShell";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import MusicList from "../components/MusicList";
import { musicService } from "../api";
import {
  FaMagnifyingGlass,
  FaMusic,
  FaUser,
  FaList,
  FaCompactDisc,
} from "react-icons/fa6";

interface SearchResult {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  url: string;
  duration: number;
  cloudinary_url: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam && queryParam !== query) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await musicService.search(searchQuery.trim());
      setSearchResults(response.results || []);
    } catch (err: any) {
      setError(err.message || "Search failed");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <h1 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
          <FaMagnifyingGlass className="text-brand" /> Search
        </h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for songs, albums, artists, genres..."
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-primary focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <Button
            icon={<FaMagnifyingGlass />}
            variant="primary"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="flex flex-row gap-4 mb-6">
          <Button
            icon={<FaCompactDisc />}
            variant="secondary"
            onClick={() => navigate("/search/album")}
          >
            Album
          </Button>
          <Button
            icon={<FaMusic />}
            variant="secondary"
            onClick={() => navigate("/audio/music")}
          >
            Song
          </Button>
          <Button
            icon={<FaUser />}
            variant="secondary"
            onClick={() => navigate("/search/profile")}
          >
            Profile
          </Button>
          <Button
            icon={<FaList />}
            variant="secondary"
            onClick={() => navigate("/playlist")}
          >
            Playlist
          </Button>
        </div>

        {/* Search Results */}
        <Card className="p-6 bg-surface">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted">Searching...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {hasSearched &&
            !isLoading &&
            !error &&
            searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted">
                  No results found for "{searchParams.get("q")}"
                </p>
              </div>
            )}

          {hasSearched && !isLoading && !error && searchResults.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Found {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for "
                {searchParams.get("q")}"
              </h2>
              <MusicList songs={searchResults} />
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-8">
              <FaMagnifyingGlass className="mx-auto text-4xl text-muted mb-4" />
              <p className="text-muted">Enter a search term to find music</p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
};

export default Search;
