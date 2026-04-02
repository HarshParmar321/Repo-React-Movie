import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDebounce } from "react-use";
import Search from "./components/search";
import MovieCard from "./components/MovieCard";
import MoviePage from "./pages/MoviePage";

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const allMovieIDs = [
  "tt4154796", "tt3896198", "tt7286456", "tt4154756", "tt1375666",
  "tt0848228", "tt0816692", "tt1877830", "tt0468569", "tt4154664",
  "tt0944947", "tt0903747", "tt2688496", "tt0111161", "tt0167260",
  "tt0071562", "tt0109830", "tt0120737", "tt0133093", "tt0108052",
  "tt0110413", "tt0114369", "tt0169547", "tt0361748", "tt1856101",
];

const getRandomMovieIDs = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const SkeletonCard = () => (
  <li className="movie-card movie-card-skeleton">
    <div className="movie-card-poster-wrap skeleton-poster shimmer" />
    <div className="movie-card-info">
      <div className="skeleton-line shimmer" style={{ width: "80%", height: 16 }} />
      <div className="skeleton-line shimmer" style={{ width: "50%", height: 12, marginTop: 8 }} />
    </div>
  </li>
);

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce the search term by 500ms
  useDebounce(
    () => {
      setDebouncedSearch(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchDefaultMovies = async () => {
    setLoading(true);
    const movieIDs = getRandomMovieIDs(allMovieIDs, 20);

    try {
      const detailedMovies = await Promise.all(
        movieIDs.map(async (id) => {
          const res = await fetch(`${API_BASE_URL}?i=${id}&apikey=${API_KEY}`);
          const data = await res.json();
          return data.Response === "True" ? data : null;
        })
      );
      setMovies(detailedMovies.filter(Boolean));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error fetching default movies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesBySearch = async () => {
    if (!debouncedSearch.trim()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `${API_BASE_URL}?s=${debouncedSearch}&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailRes = await fetch(
              `${API_BASE_URL}?i=${movie.imdbID}&apikey=${API_KEY}`
            );
            const detailData = await detailRes.json();
            return detailData.Response === "True" ? detailData : null;
          })
        );
        setMovies(detailedMovies.filter(Boolean));
        setErrorMessage("");
      } else {
        setMovies([]);
        setErrorMessage(data.Error || "No results found.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchMoviesBySearch();
    } else {
      fetchDefaultMovies();
    }
  }, [debouncedSearch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <div className="pattern" />
              <div className="wrapper">
                <header>
                  <img src="./hero.png" alt="CineVault hero banner" className="hero" />
                  <h1>
                    Find <span className="text-gradient">Movies</span> You'll
                    Love
                  </h1>
                  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                  <h2>
                    {debouncedSearch.trim()
                      ? `Results for "${debouncedSearch}"`
                      : "Trending Movies"}
                  </h2>

                  {/* Error state */}
                  {errorMessage && !loading && (
                    <div className="movies-empty-state">
                      <img src="/no-movie.png" alt="No results" />
                      <p>{errorMessage}</p>
                      <button
                        className="retry-btn"
                        onClick={() =>
                          debouncedSearch.trim()
                            ? fetchMoviesBySearch()
                            : fetchDefaultMovies()
                        }
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Loading skeletons */}
                  {loading && (
                    <ul className="movie-grid">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </ul>
                  )}

                  {/* Movie grid */}
                  {!loading && !errorMessage && movies.length > 0 && (
                    <ul className="movie-grid">
                      {movies.map((movie, index) => (
                        <MovieCard
                          key={movie.imdbID}
                          movie={movie}
                          index={index}
                        />
                      ))}
                    </ul>
                  )}

                  {/* Empty state (no error, no results) */}
                  {!loading && !errorMessage && movies.length === 0 && (
                    <div className="movies-empty-state">
                      <img src="/no-movie.png" alt="No movies" />
                      <p>No movies found. Try a different search!</p>
                    </div>
                  )}
                </section>
              </div>
            </main>
          }
        />
        <Route path="/movie/:imdbID" element={<MoviePage />} />
      </Routes>
    </Router>
  );
};

export default App;
