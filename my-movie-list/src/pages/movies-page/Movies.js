import "./Movies.css";
import MovieSlider from "../../components/MovieSlider";
import MovieGrid from "../../components/MovieGrid";
import { useState, useEffect } from "react";
import axios from "axios";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function Movies() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchedMovie, setSearchedMovie] = useState("");
  const [moviesFromSearch, setMoviesFromSearch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const closeGrid = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getTrendingMovies"
        );

        const movies = response.data.movie;
        setTrendingMovies(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request Error:", error.request);
        } else {
          // Something else happened while setting up the request
          console.error("Error:", error.message);
        }
      }
    };

    getTrendingMovies();
  }, []);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getPopularMovies"
        );
        const movies = response.data.movie;
        setPopularMovies(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request Error:", error.request);
        } else {
          // Something else happened while setting up the request
          console.error("Error:", error.message);
        }
      }
    };

    getPopularMovies();
  }, []);

  const getMovieBySearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getMoviesFromSearch",
        {
          params: { movie: searchedMovie },
        }
      );
      console.log(response.data);
      setMoviesFromSearch(response.data.movie);
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovieBySearch();
    setIsOpen(true);
  };

  return (
    <>
      <section id="search-movie-container" className="section-container">
        <div id="search-bar-container">
          <form id="search-form" onSubmit={handleSubmit}>
            <label htmlFor="search-input" id="search-label">
              Search for any movie by movie name:
            </label>
            <input
              type="text"
              id="search-input"
              onChange={(e) => {
                setSearchedMovie(e.target.value);
              }}
            />
            <button id="search-submit-btn" className="button" type="submit">
              Search
            </button>
          </form>
          <span className="dropup" onClick={closeGrid}>
            {isOpen && <ArrowDropUpIcon />}
          </span>
        </div>
        {moviesFromSearch.length > 0 && isOpen && (
          <MovieGrid searchResult={moviesFromSearch} />
        )}
      </section>
      <MovieSlider genre="Trending" movies={trendingMovies} />
      <MovieSlider genre="Popular" movies={popularMovies} />
    </>
  );
}

export default Movies;
