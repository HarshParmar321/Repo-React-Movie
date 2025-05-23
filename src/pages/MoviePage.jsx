import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MoviePage = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}?i=${imdbID}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [imdbID]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="all-movies">
      <h1>{movie.Title} ({movie.Year})</h1>
      <img src={movie.Poster} alt={movie.Title} />
      <p>{movie.Plot}</p>
      <p>Director: {movie.Director}</p>
      <div className="rating flex items-center gap-2">
        <img src="/star.svg" alt="star" style={{ width: 20, height: 20 }} />
        <span>{movie.imdbRating}</span>
      </div>
      {/* Add more details as you like */}
    </div>
  );
};

export default MoviePage;