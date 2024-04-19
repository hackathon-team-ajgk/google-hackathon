require("dotenv").config();
const API_READ_ACCESS_TOKEN = process.env.API_READ_ACCESS_TOKEN;
const { json } = require("express");
const fetch = require('node-fetch');


// Functions requiring API endpoints:
// Working movie search 
function searchForMovie(search_query) {
  const formatted_query = search_query.replace(' ', '%20');
  const url = `https://api.themoviedb.org/3/search/movie?query=${formatted_query}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`
    }
  };

  return fetch(url, options)
    .then(res => res.json())
    .then(json => {
      // Iterate over each movie result to stringify the genre_ids array
      const formattedResults = json.results.map(movie => ({
        ...movie,
        genre_ids: JSON.stringify(movie.genre_ids) // Stringify the genre_ids array
      }));
      // console.log(json)
      return json; // Return the JSON data from the resolved Promise
    })
    .catch(err => {
      console.error('error:', err);
      throw err; // Throw the error to propagate it to the caller
    });
}
searchForMovie("star wars the force awakens")


// Working get list of popular movies 
function getPopularMovieHandler() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=2';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`
      }
    };
    
    return fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));

}
// getPopularMovieHandler()

// DOESNT WORK AS INTENDED. Not sure why
function getWatchProviderHandler() {
    const movie_id = '140607'
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`
      }
    };
    
    return fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
}
// getWatchProviderHandler()

// Functions for parsing information
async function getMovieMetadata() {
  return new Promise(async (resolve, reject) => {
    try {
      const rawMovieName = "Star Wars the force awakens";  // REPLACE THIS WITH USER INPUT
      const movie_obj = await searchForMovie(rawMovieName);

      if (!movie_obj || !movie_obj.results) {
        console.error("No movie data found");
        reject("No movie data found");
        return;
      }

      // Mapping genre IDs to names
      const genreDict = {
        "genres": [
          { "id": 28, "name": "Action" },
          { "id": 12, "name": "Adventure" },
          { "id": 16, "name": "Animation" },
          { "id": 35, "name": "Comedy" },
          { "id": 80, "name": "Crime" },
          { "id": 99, "name": "Documentary" },
          { "id": 18, "name": "Drama" },
          { "id": 10751, "name": "Family" },
          { "id": 14, "name": "Fantasy" },
          { "id": 36, "name": "History" },
          { "id": 27, "name": "Horror" },
          { "id": 10402, "name": "Music" },
          { "id": 9648, "name": "Mystery" },
          { "id": 10749, "name": "Romance" },
          { "id": 878, "name": "Science Fiction" },
          { "id": 10770, "name": "TV Movie" },
          { "id": 53, "name": "Thriller" },
          { "id": 10752, "name": "War" },
          { "id": 37, "name": "Western" }
        ]
      };

      const movieMetadata = movie_obj.results.map(movie => ({
        movieId: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        genreIds: JSON.stringify(movie.genre_ids), // Stringify genre IDs
        genreNames: movie.genre_ids.map(genreId => { // Map genre IDs to names
          const genre = genreDict.genres.find(genre => genre.id === genreId);
          return genre ? genre.name : "Unknown Genre";
        }).join(','), // Join genre names into a single string
        coverImage: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        popularity: movie.popularity,
        averageRating: movie.vote_average
      }));

      const newData = {
        movie: movieMetadata
      };
      
      resolve(newData);
    } catch (error) {
      console.error("Error formatting movie metadata:", error);
      reject(error);
    }
  });
}

// Below only for testing purposes
async function viewMovieMetadata() {
  x = await getMovieMetadata();
  console.log(x)
}
viewMovieMetadata()