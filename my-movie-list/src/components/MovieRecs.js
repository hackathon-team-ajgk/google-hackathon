import { useState } from "react";
import axios from "axios";
import MovieSlider from "./MovieSlider";

function MovieRecs() {
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];

  const [genre, setGenre] = useState("Action");
  const [suggestionsByGenre, setSuggestionsByGenre] = useState([]);

  // Function to update the state based on the option selected by the user
  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const getRecommendationsByGenre = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getRecommendations-genre",
        {
          params: { genre: genre },
        }
      );
      console.log(response.data);
      setSuggestionsByGenre(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Get Error:", error.response.data);
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

  const handleGetRecsSubmit = (event) => {
    event.preventDefault();
    getRecommendationsByGenre();
  };
  return (
    <>
      <section id="ai-suggestions-by-genre" className="section-container">
        <form className="genre-recs-container" onSubmit={handleGetRecsSubmit}>
          <p id="ai-sugg-heading">
            Get AI Movie Recommendations Based On Genre
          </p>
          <select
            className="genres-container"
            value={genre}
            onChange={handleGenreChange}
          >
            {genres.map((val, key) => (
              <option key={`genre-${key}`} value={val}>
                {val}
              </option>
            ))}
          </select>
          <button id="get-recs-btn" type="submit" className="button">
            Get Recommendations
          </button>
        </form>
      </section>
      {suggestionsByGenre.length > 0 && (
        <MovieSlider genre={`Recommendations`} movies={suggestionsByGenre} />
      )}
    </>
  );
}

export default MovieRecs;
