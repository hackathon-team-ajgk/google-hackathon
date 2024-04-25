import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

function MovieView({ movieInfo, toggleOverlay }) {
  console.log(movieInfo);
  return (
    <div className="overlay">
      <div id="movie-view-page">
        <img
          src={movieInfo.coverImage}
          alt="movie cover"
          id="movie-view-image"
        />
        <div id="movie-view-title-overview" className="text-container">
          <p id="movie-view-title" className="movie-text">
            {movieInfo.title}
          </p>
          <p id="movie-overview" className="movie-text">
            {movieInfo.overview}
          </p>
          <div id="other-movie-information" className="text-container">
            <p id="movie-genres" className="movie-text">
              <strong>Genres:</strong> {movieInfo.genreNames}
            </p>
            <p id="movie-average-rating" className="movie-text">
              <strong>Average Rating:</strong> {movieInfo.averageRating}
            </p>
            <p id="movie-average-rating" className="movie-text">
              <strong>Release Date:</strong> {movieInfo.releaseDate}
            </p>
            <p id="movie-user-rating" className="movie-text">
              <label id="movie-rating-label" htmlFor="movie-rating-input">
                User Rating:
              </label>
              {movieInfo.userRating !== "NULL" ? (
                <>{movieInfo.userRating}</>
              ) : (
                <input type="number" max="10" id="movie-rating-input" />
              )}
            </p>
          </div>
        </div>
        <div id="close-button-div" onClick={toggleOverlay}>
          <CloseFullscreenIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
}

export default MovieView;
