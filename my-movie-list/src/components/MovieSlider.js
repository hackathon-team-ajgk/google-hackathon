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
        {movies.length === 0 && <h2>Your List Is Empty.</h2>}
      </section>
    </>
  );
}

export default MovieSlider;
