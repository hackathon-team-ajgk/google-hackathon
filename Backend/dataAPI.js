require("dotenv").config();
const API_READ_ACCESS_TOKEN = process.env.API_READ_ACCESS_TOKEN;
const { json } = require("express");
const fetch = require('node-fetch');


// Functions requiring API endpoints:
// Working movie search 
function searchForMovie(search_query) {
    const formatted_quary = search_query.replace(' ', '%20');
    const url = `https://api.themoviedb.org/3/search/movie?query=${formatted_quary}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`
      }
    };

    const result = fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));

    return result;
}
// searchForMovie("star wars the force awakens")

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
    
    const result = fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));

      return result;
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
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
}
// getWatchProviderHandler()

// Functions for parsing information

// Issues on line 76 'result'
async function getMovieMetadata() {
    // Must get id, title, release_date, genre_ids, poster_path
    const rawMovieName = "Star Wars the force awakens";
    const movie_obj = await searchForMovie(rawMovieName)
    console.log(movie_obj)
    const movieMetadata = movie_obj.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids,
        poster_path: movie.poster_path
      }));

    const newData = {
        movies: movieMetadata
    };

    console.log(newData)
}
getMovieMetadata()