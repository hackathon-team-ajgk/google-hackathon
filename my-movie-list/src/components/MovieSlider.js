import MovieCard from "./MovieCard";

function MovieSlider({ movies, genre }) {
  return (
    <>
      <p id="trending-movies-label" className="movie-label">
        {genre}
      </p>
      <section id="popular-movies-section" className="section-container">
        {movies.map((val, key) => (
          <MovieCard key={`${genre}-${key}`} movie={val} />
        ))}
      </section>
    </>
  );
}

export default MovieSlider;
