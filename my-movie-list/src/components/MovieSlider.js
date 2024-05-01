import MovieCard from "./MovieCard";
import { useId } from "react";

function MovieSlider({ movies, genre }) {
  const movieSliderId = useId();
  return (
    <div id={`slider-${movieSliderId}`} className="movie-slider-container">
      <p className="movie-label">{genre}</p>
      <section className="movie-slider">
        {movies.map((val, key) => (
          <MovieCard key={`${genre}-${key}`} movie={val} />
        ))}
        {movies.length === 0 && <h2>Your List Is Empty.</h2>}
      </section>
    </div>
  );
}

export default MovieSlider;
