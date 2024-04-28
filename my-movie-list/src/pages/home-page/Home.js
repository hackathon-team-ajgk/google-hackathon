import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import HeroMovies from "../../components/HeroMovies";
import MovieSlider from "../../components/MovieSlider";

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);

  const navigate = useNavigate();

  const storeTrendingMovies = (movies) => {
    setTrendingMovies(movies);
  };

  const getHeroMovies = useCallback(() => {
    const firstThreeMovies = trendingMovies.slice(0, 3);
    setHeroMovies(firstThreeMovies);
  }, [trendingMovies]);

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getTrendingMovies"
        );
        const movies = response.data.movie;
        storeTrendingMovies(movies);
      } catch (error) {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code not within 2xx
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
    if (trendingMovies.length > 0) {
      getHeroMovies();
    }
  }, [trendingMovies, getHeroMovies]);

  return (
    <>
      <section id="hero-section" className="section-container">
        <div id="text-container">
          <p className="hero-section-text">
            Save your favourite movies and create your own personalized movie
            list so that you always know what to watch next!
          </p>
          <p id="bold-hero-text" className="hero-section-text">
            Create your Movie List today.
          </p>
          <button
            id="hero-button"
            className="home-button"
            onClick={() => {
              navigate("/your-list");
            }}
          >
            Your Movie List
          </button>
        </div>
        <div id="hero-movie-images" className="images">
          {heroMovies.length === 3 && <HeroMovies movies={heroMovies} />}
        </div>
      </section>
      <MovieSlider genre="Trending" movies={trendingMovies} />
      <section id="ai-suggestions" className="section-container">
        <div id="ai-sugg-text-container">
          <strong id="ai-sugg-main-text" className="home-text">
            Can't think of what movie to watch next?
          </strong>
          <p id="ai-sugg-secondary-text" className="home-text">
            Use <strong>Google’s AI Gemini</strong> to generate movie
            suggestions based on your prompt!
          </p>
          <p className="home-text">
            Ask any prompt relevant to movies, for example, “My favourite movies
            are the star wars movies, lord of the rings, and dune. What movies
            would you suggest I watch based off these movies?”
          </p>
          <input
            id="ai-sugg-input"
            placeholder="Enter your prompt here."
            type="text"
          />
        </div>
      </section>
      {/* {section below should only be rendered if user is not logged in} */}
      <section id="cta" className="section-container">
        <div id="cta-div">
          <strong id="cta-title" className="cta-text">
            Create an Account Today!
          </strong>
          <p className="cta-text">
            Join the community and start adding to your own movie list today.
            Always have something to watch next and an AI tool that gives you
            suggestions if you're still not sure!
          </p>
          <button
            className="home-button"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register Now
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
