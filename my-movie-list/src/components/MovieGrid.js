import MovieCard from "./MovieCard";
import "../pages/movies-page/Movies.css";

function MovieGrid({ searchResult }) {
  return (
    <>
      {console.log(searchResult)}
      <div className="movie-grid">
        {searchResult.map((val, key) => (
          <MovieCard key={`searched-${key}`} movie={val} />
        ))}
      </div>
    </>
  );
}

export default MovieGrid;
