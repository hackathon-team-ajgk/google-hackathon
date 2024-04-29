import "./YourList.css";
import MovieSlider from "../../components/MovieSlider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function YourList() {
  const { getToken, getUsername } = useAuth();

  const [watched, setWatched] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [suggestionsByList, setSuggestionsByList] = useState([]);

  // useEffect(() => {
  //   const getUserRecommendationsByList = async () => {
  //     try {
  //       const token = getToken();
  //       const response = await axios.get(
  //         "http://localhost:3000/getRecommendations-list"
  //       );
  //     } catch (error) {
  //       if (error.response) {
  //         // The server responded with a status code that falls out of the range of 2xx
  //         console.error("Get Error:", error.response.data);
  //         console.error("Status Code:", error.response.status);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.error("Request Error:", error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.error("Error:", error.message);
  //       }
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const getUserMovieData = async () => {
      try {
        const token = getToken();
        const username = getUsername();
        const response = await axios.get(
          "http://localhost:3000/getUserMovieData",
          {
            headers: {
              authorization: token,
            },
            params: {
              username: username,
            },
          }
        );
        setWatchLater(response.data.watchLaterList);
        setWatched(response.data.watchedMovies);
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
    getUserMovieData();
  }, [getToken, getUsername]);

  return (
    <>
      <MovieSlider genre="Watched Movies" movies={watched} />
      <MovieSlider genre="Watching Soon" movies={watchLater} />
      {/* <MovieGrid searchResult={suggestionsByList} /> */}
    </>
  );
}

export default YourList;
