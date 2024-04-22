require("dotenv").config( {path: '../.env'} );
const API_READ_ACCESS_TOKEN = process.env.API_READ_ACCESS_TOKEN;
// console.log(API_READ_ACCESS_TOKEN);
const { json } = require("express");
const fetch = require('node-fetch');


// Functions requiring API endpoints:
// Working movie search 
function searchForMovie(search_query) {
  try {
    const formatted_query = search_query.replace(' ', '%20');
    const url = `https://api.themoviedb.org/3/search/movie?query=${formatted_query}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`
      }
    };
    console.log(options);
  
    return fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log('API Response:', json); // Log the API response
        if (!json || !json.results) {
          console.error('Invalid API Response:', json); // Log if response is invalid
          throw new Error('Invalid API Response');
        }
        // Iterate over each movie result to stringify the genre_ids array
        const formattedResults = json.results.map(movie => ({
          ...movie,
          genre_ids: JSON.stringify(movie.genre_ids) // Stringify the genre_ids array
        }));
        // console.log(json)
        return json; // Return the JSON data from the resolved Promise
      })
      .catch(err => {
        console.error('Error fetching movie data:', err);
        throw err; // Throw the error to propagate it to the caller
      });
  } catch (error) {
    console.error("Error searching for movie(s)", error);
    throw error; // Throw the error to propagate it to the caller
  }
}
// searchForMovie("harry potter")


// Working get list of popular movies 
function getPopularMovieHandler() {
  try {
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
  } catch (error) {
    console.error("Error getting popular movies", error)
  }
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
      const rawMovieName = "harry potter";  // REPLACE THIS WITH USER INPUT
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

      if (movie_obj.results && movie_obj.results.length > 0) {
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
          averageRating: movie.vote_average,
          overview: movie.overview
        }));
        
        const newData = {
          movie: movieMetadata
        };
      
        filterMovieData(newData);
      
        resolve(newData);
      } else {
        // Handle the case where movie_obj.results is empty or undefined
        console.error("No movie data found");
        reject("No movie data found");
      }
    } catch (error) {
      console.error("Error getting movie metadata:", error);
      reject(error);
    }
  });
}

function filterMovieData(movieMetadata) {
  try {
    // Iterate through each movie object
    for (const movie of movieMetadata.movie) {
      // If movie doesnt have genre, title, or movieId, remove movie from results.
      const filteredMovies = movieMetadata.movie.filter(movie => {
        return movie.genreNames !== '' && movie.title !== '' && !isNaN(movie.movieId);
      });
      movieMetadata.movie = filteredMovies;

      // Replace empty strings and zeros with 'NULL' for specific properties
      movie.releaseDate = movie.releaseDate === '' ? 'NULL' : movie.releaseDate;
      movie.popularity = movie.popularity === 0 ? 'NULL' : movie.popularity;
      movie.averageRating = movie.averageRating === 0 ? 'NULL' : movie.averageRating;
      movie.overview = movie.overview === '' ? 'NULL' : movie.overview;

      // Check if the cover image ends with '.jpg', otherwise replace it with 'NULL'
      if (!/\.jpg$/.test(movie.coverImage)) {
        movie.coverImage = 'NULL';
      }
    }
  } catch (err) {
    console.error("Error filtering movie metadata:", err);
  }
}


// Below only for testing purposes
async function viewMovieMetadata() {
  x = await getMovieMetadata();
  console.log(x)
}
viewMovieMetadata()

/* 
TO DO:
- Only english movies?
- Add more endpoint calls for potential info frontend might need
- Remember to optimize function calls and interactions so load times are as low as possible
*/