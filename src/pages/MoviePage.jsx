import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MoviePage = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}?i=${imdbID}&apikey=${API_KEY}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error || "Movie not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch movie details.");
        setLoading(false);
      });
  }, [imdbID]);

  if (loading) {
    return (
      <main className="movie-detail-page">
        <div className="movie-detail-skeleton">
          <div className="skeleton-backdrop shimmer" />
          <div className="movie-detail-body">
            <div className="skeleton-poster shimmer" />
            <div className="skeleton-info">
              <div className="skeleton-line skeleton-title shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line skeleton-short shimmer" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="movie-detail-page">
        <div className="movie-detail-error">
          <img src="/no-movie.png" alt="Error" />
          <h2>{error}</h2>
          <Link to="/" className="movie-detail-back">← Back to Home</Link>
        </div>
      </main>
    );
  }

  const posterSrc =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/no-movie.png";

  return (
    <main className="movie-detail-page">
      {/* Backdrop */}
      <div className="movie-detail-backdrop">
        <img src={posterSrc} alt="" aria-hidden="true" />
        <div className="movie-detail-backdrop-gradient" />
      </div>

      {/* Content */}
      <div className="movie-detail-content fade-in-up">
        <Link to="/" className="movie-detail-back">
          ← Back to Home
        </Link>

        <div className="movie-detail-body">
          {/* Poster */}
          <div className="movie-detail-poster">
            <img src={posterSrc} alt={movie.Title} />
          </div>

          {/* Info */}
          <div className="movie-detail-info">
            <h1 className="movie-detail-title">{movie.Title}</h1>

            <div className="movie-detail-meta">
              <span className="movie-detail-year">{movie.Year}</span>
              {movie.Rated && movie.Rated !== "N/A" && (
                <span className="movie-detail-rated">{movie.Rated}</span>
              )}
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <span className="movie-detail-runtime">{movie.Runtime}</span>
              )}
            </div>

            {/* Rating */}
            <div className="movie-detail-rating-row">
              <div className="movie-detail-rating-badge">
                <img src="/star.svg" alt="star" />
                <span className="movie-detail-rating-value">
                  {movie.imdbRating && movie.imdbRating !== "N/A"
                    ? movie.imdbRating
                    : "—"}
                </span>
                <span className="movie-detail-rating-max">/10</span>
              </div>
              {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                <span className="movie-detail-votes">
                  {parseInt(movie.imdbVotes.replace(/,/g, "")).toLocaleString()} votes
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="movie-detail-genres">
                {movie.Genre.split(",").map((g) => (
                  <span key={g.trim()} className="movie-detail-genre-tag">
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="movie-detail-section">
                <h2>Storyline</h2>
                <p>{movie.Plot}</p>
              </div>
            )}

            {/* Credits */}
            <div className="movie-detail-credits">
              {movie.Director && movie.Director !== "N/A" && (
                <div className="movie-detail-credit">
                  <span className="credit-label">Director</span>
                  <span className="credit-value">{movie.Director}</span>
                </div>
              )}
              {movie.Writer && movie.Writer !== "N/A" && (
                <div className="movie-detail-credit">
                  <span className="credit-label">Writer</span>
                  <span className="credit-value">{movie.Writer}</span>
                </div>
              )}
              {movie.Actors && movie.Actors !== "N/A" && (
                <div className="movie-detail-credit">
                  <span className="credit-label">Cast</span>
                  <span className="credit-value">{movie.Actors}</span>
                </div>
              )}
              {movie.Language && movie.Language !== "N/A" && (
                <div className="movie-detail-credit">
                  <span className="credit-label">Language</span>
                  <span className="credit-value">{movie.Language}</span>
                </div>
              )}
            </div>

            {/* Box Office & Awards */}
            <div className="movie-detail-extras">
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className="movie-detail-extra-card">
                  <span className="extra-label">💰 Box Office</span>
                  <span className="extra-value">{movie.BoxOffice}</span>
                </div>
              )}
              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="movie-detail-extra-card">
                  <span className="extra-label">🏆 Awards</span>
                  <span className="extra-value">{movie.Awards}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MoviePage;