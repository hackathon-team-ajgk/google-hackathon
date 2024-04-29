import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";

function MovieView({ movieInfo, toggleOverlay }) {
  const { getUsername, getToken, getUserMovieData } = useAuth();
  const [movieStatus, setMovieStatus] = useState("Not in List");
  const [rating, setRating] = useState(movieInfo.userRating);

  useEffect(() => {
    const checkMovieInList = () => {
      const movieData = getUserMovieData();
      const watchLater = movieData.watchLaterList.find(
        (movie) => movie.movieId === movieInfo.movieId
      );
      if (watchLater !== undefined) {
        console.log(watchLater);
        setMovieStatus("Watching Soon");
      } else {
        const watched = movieData.watchedMovies.find(
          (movie) => movie.movieId === movieInfo.movieId
        );
        if (watched !== undefined) {
          setMovieStatus("Watched");
          setRating(watched.userRating);
        } else {
          setMovieStatus("Not in List");
        }
      }
    };
    checkMovieInList();
  }, [getUserMovieData, movieInfo]);

  const updateMovieRating = async (movieRating) => {
    try {
      const token = getToken();
      const username = getUsername();
      const response = await axios.put(
        "http://localhost:3000/update-user-rating",
        {
          username: username,
          movieTitle: movieInfo.title,
          userRating: movieRating,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        window.alert(
          "The movie is not in your watched list. Please add it to your list of watched movies first."
        );
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        setRating(0);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const addToList = async (action) => {
    try {
      const username = getUsername();
      const token = getToken();
      const response = await axios.put(
        "http://localhost:3000/edit-movie-state",
        {
          username: username,
          action: action,
          movie: movieInfo,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
      if (action === "watch") {
        setMovieStatus("Watched");
      } else {
        setMovieStatus("Watching Soon");
      }
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const removeFromList = async () => {
    try {
      const username = getUsername();
      const token = getToken();
      const response = await axios.put(
        "http://localhost:3000/remove-movie",
        {
          username: username,
          movieName: movieInfo.title,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setMovieStatus("Not in List");
      setRating(0);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

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
              <strong className="movie-metadata">Genres:</strong>{" "}
              {movieInfo.genreNames}
            </p>
            <p id="movie-average-rating" className="movie-text">
              <strong className="movie-metadata">Average Rating:</strong>{" "}
              {movieInfo.averageRating}
            </p>
            <p id="movie-release-date" className="movie-text">
              <strong className="movie-metadata">Release Date:</strong>{" "}
              {movieInfo.releaseDate}
            </p>
            <div id="movie-user-rating" className="movie-text">
              <label id="movie-rating-label" className="movie-metadata">
                User Rating:
              </label>
              <Rating
                name="simple-controlled"
                value={rating}
                sx={{
                  "& .MuiRating-icon": {
                    color: "white",
                  },
                }}
                onChange={(event, newRating) => {
                  setRating(newRating);
                  updateMovieRating(newRating);
                }}
              />
            </div>
            <p id="movie-status" className="movie-text">
              {movieStatus}
            </p>
          </div>
        </div>
        <div id="close-button-div" onClick={toggleOverlay}>
          <CloseFullscreenIcon fontSize="large" />
        </div>
        <div id="edit-button-group" className="button-group">
          {movieStatus !== "Watched" ? (
            <button
              className="button"
              onClick={() => {
                addToList("watch");
              }}
            >
              Add to Watched
            </button>
          ) : (
            <button
              className="button"
              onClick={() => {
                removeFromList();
              }}
            >
              Remove from Watched
            </button>
          )}
          {movieStatus !== "Watching Soon" ? (
            <button
              className="button"
              onClick={() => {
                addToList("watch-later");
              }}
            >
              Add to Watch Later
            </button>
          ) : (
            <button
              className="button"
              onClick={() => {
                removeFromList();
              }}
            >
              Remove from Watch Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieView;
