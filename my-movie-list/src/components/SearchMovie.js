import MovieGrid from "./MovieGrid";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { useState } from "react";

function SearchMovie() {
  const [searchedMovie, setSearchedMovie] = useState("");
  const [moviesFromSearch, setMoviesFromSearch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleGrid = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovieBySearch();
  };

  const getMovieBySearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getMoviesFromSearch",
        {
          params: { movie: searchedMovie },
        }
      );
      setMoviesFromSearch(response.data.movie);
      setIsOpen(true);
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        window.alert(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error:", error.message);
      }
    }
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
          <span className="dropup" onClick={toggleGrid}>
            {isOpen && <ArrowDropUpIcon fontSize="large" />}
            {!isOpen && moviesFromSearch.length > 0 && (
              <ArrowDropDownIcon fontSize="large" />
            )}
          </span>
        </div>
      </section>
      {moviesFromSearch.length > 0 && isOpen && (
        <MovieGrid searchResult={moviesFromSearch} />
      )}
    </>
  );
}

export default SearchMovie;
