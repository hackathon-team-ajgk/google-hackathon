import "../pages/home-page/Home.css";
import { useState } from "react";
import MovieView from "./MovieView";

function MovieCard({ movie }) {
  const [overlayOn, setOverlayOn] = useState(false);

  // Function to toggle overlay visibility
  const toggleOverlay = () => {
    setOverlayOn(!overlayOn);
  };
  return (
    <>
      <div className="movie-card" onClick={toggleOverlay}>
        <img className="movie-image" src={movie.coverImage} alt="movie cover" />
        <p className="movie-title">{movie.title}</p>
      </div>
      {overlayOn && (
        <MovieView movieInfo={movie} toggleOverlay={toggleOverlay} />
      )}
    </>
  );
}

export default MovieCard;
