import "../pages/home-page/Home.css";
import { useState } from "react";
import MovieView from "./MovieView";

function MovieCard({ movie }) {
  const [overlayOn, setOverlayOn] = useState(false);

  // Function to toggle overlay visibility
  const toggleOverlay = () => {
    setOverlayOn(!overlayOn);
  };

  // Function toggle overlay visibility OFF
  const removeOverlay = () => {
    if (overlayOn === true) {
      setOverlayOn(!overlayOn)
    }
  };
  return (
    <>
      <div className="movie-card" onClick={toggleOverlay}>
        <img className="movie-image" src={movie.coverImage} alt="movie cover" />
        <p className="movie-title">
          {movie.title.length > 40
            ? movie.title.slice(0, 40) + "..."
            : movie.title}
        </p>
      </div>
      {overlayOn && (
        <MovieView movieInfo={movie} toggleOverlay={toggleOverlay} />
      )}
    </>
  );
}

export default MovieCard;
