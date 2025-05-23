import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Search from "./components/search";
import MoviePage from "./pages/MoviePage";

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const allMovieIDs = [
  "tt4154796", "tt3896198", "tt7286456", "tt4154756", "tt1375666", // Inception
  "tt0848228", "tt0816692", "tt1877830", "tt0468569", "tt4154664",
  "tt0944947", "tt0903747", "tt2688496", "tt0111161", "tt0167260", 
  "tt0071562", "tt0109830", "tt0120737", "tt0133093", "tt0108052",
  "tt0110413", "tt0114369", "tt0169547", "tt0361748", "tt1856101"
];

// Shuffle and pick 20 random movie IDs
const getRandomMovieIDs = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchDefaultMovies = async () => {
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
    } catch (error) {
      setErrorMessage("Error fetching default movies.");
    }
  };

  const fetchMoviesBySearch = async () => {
    if (!searchTerm.trim()) {
      setErrorMessage("Please enter a search term.");
      setMovies([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}?s=${searchTerm}&apikey=${API_KEY}`);
      const data = await res.json();

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailRes = await fetch(`${API_BASE_URL}?i=${movie.imdbID}&apikey=${API_KEY}`);
            const detailData = await detailRes.json();
            return detailData.Response === "True" ? detailData : null;
          })
        );
        setMovies(detailedMovies.filter(Boolean));
        setErrorMessage("");
      } else {
        setMovies([]);
        setErrorMessage(`API Error: ${data.Error}`);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch movies.");
      setMovies([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchMoviesBySearch();
    } else {
      fetchDefaultMovies(); // fetch random movies on first load or when search is empty
    }
  }, [searchTerm]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main>
            <div className="pattern" />
            <div className="wrapper">
              <header>
                <img src="./hero.png" alt="hero" className="hero" />
                <h1>
                  Find <span className="text-gradient">Movie</span> you want to watch
                </h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </header>
              <section className="all-movies">
                <h2>All Movies</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <ul>
                  {movies.map((movie) => (
                    <li key={movie.imdbID}>
                      <Link to={`/movie/${movie.imdbID}`}>
                        <img src={movie.Poster} alt={movie.Title} />
                        <h3>
                          {movie.Title} ({movie.Year})
                        </h3>
                      </Link>
                      <p>{movie.Plot}</p>
                      <p>Director: {movie.Director}</p>
                      <div className="rating flex items-center gap-2">
                        <img src="./star.svg" alt="star" className="w-5 h-5 inline-block" />
                        <span>{movie.imdbRating}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </main>
        } />
        <Route path="/movie/:imdbID" element={<MoviePage />} />
      </Routes>
    </Router>
  );
};

export default App;
