import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie, index }) => {
  const posterSrc =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "/no-movie.png";

  return (
    <li
      className="movie-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/movie/${movie.imdbID}`} className="movie-card-link">
        <div className="movie-card-poster-wrap">
          <img src={posterSrc} alt={movie.Title} loading="lazy" />
          <div className="movie-card-overlay">
            <span className="movie-card-view">View Details</span>
          </div>
        </div>

        <div className="movie-card-info">
          <h3>{movie.Title}</h3>

          <div className="movie-card-meta">
            <div className="movie-card-rating">
              <img src="/star.svg" alt="star" />
              <span>{movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "—"}</span>
            </div>
            <span className="movie-card-dot">•</span>
            <span className="movie-card-year">{movie.Year}</span>
          </div>

          {movie.Genre && movie.Genre !== "N/A" && (
            <div className="movie-card-genres">
              {movie.Genre.split(",")
                .slice(0, 2)
                .map((g) => (
                  <span key={g.trim()} className="movie-card-genre-tag">
                    {g.trim()}
                  </span>
                ))}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

export default MovieCard;
