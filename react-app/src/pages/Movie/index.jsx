import React from 'react';
import './index.css'; // Importing the CSS file for styling

const Movie = () => {
  return (
    <div className="movie-page">
      <h1 className="movie-title">Movie Title</h1>
      <img src="path_to_movie_image.jpg" alt="Movie Poster" className="movie-poster" />
      <p className="movie-description">This is a brief description of the movie. It provides an overview of the plot, characters, and themes.</p>
      <div className="movie-details">
        <h2>Details</h2>
        <p><strong>Release Date:</strong> YYYY-MM-DD</p>
        <p><strong>Director:</strong> Director Name</p>
        <p><strong>Cast:</strong> Actor 1, Actor 2, Actor 3</p>
      </div>
    </div>
  );
};

export default Movie;