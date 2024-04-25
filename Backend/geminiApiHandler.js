const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const API_READ_ACCESS_TOKEN = process.env.GEMINI_API;
const { json } = require("express");
const fetch = require('node-fetch');

const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(API_READ_ACCESS_TOKEN)
const model = genAI.getGenerativeModel({model: "gemini-pro"})
const fs = require('fs')

async function giveMovieSuggestionsBasedOnGenre(userText) {
    
    const message = "Give me a list of ten movies in array format based on this genre without the year:  "
    
    //perform i/o validation 
    const result = await model.generateContent(message+userText)
    const response = await result.response;
    const text = response.text()
    console.log(text)

    //error handling 
    return text
}

//Tallies the most popular genres in the users movie list, and then returns movies that are related to those genres 
async function tallyGenreInMovieList() {
    const fs = require('fs').promises; // Use fs.promises for promise-based file operations

    try {
        const data = await fs.readFile(path.join(__dirname, './object.json'), 'utf-8');
        const jsonData = JSON.parse(data);

        const genreTallyTotal = {
            "Action": 0,
            "Adventure": 0,
            "Animation": 0,
            "Comedy": 0,
            "Crime": 0,
            "Documentary": 0,
            "Drama": 0,
            "Family": 0,
            "Fantasy": 0,
            "History": 0,
            "Horror": 0,
            "Music": 0,
            "Mystery": 0,
            "Romance": 0,
            "Science Fiction": 0,
            "TV Movie": 0,
            "Thriller": 0,
            "War": 0,
            "Western": 0
        };

        const watchedMoviesList = jsonData.movieData.watchedMovies.movie;
        const watchLaterList = jsonData.movieData.watchLaterList.movie;

        watchedMoviesList.forEach(movie => {
            movie.genreNames.split(',').forEach(item => {
                if (item in genreTallyTotal) {
                    genreTallyTotal[item] += 1;
                }
            });
        });

        watchLaterList.forEach(movie => {
            movie.genreNames.split(',').forEach(item => {
                if (item in genreTallyTotal) {
                    genreTallyTotal[item] += 1;
                }
            });
        });

        // console.log(genreTallyTotal);
        return genreTallyTotal
        
    } catch (error) {
        console.error('Error reading file:', error);
        throw error; // Re-throw the error to handle it outside this function
    }
}
// tallyGenreInMovieList()

// Make function that takes dictionary as input to gemini
async function giveMovieSuggestionsBasedOnMovieList() {
    const dictionary = await tallyGenreInMovieList()
    const formattedDictionary = JSON.stringify(dictionary)
    
    const message = 'Can you give 10 movie suggestions based on the two highest genres in this dictionary. Give me this informantion in JavaScript array format, without genres, numbers, or single/double quotations encapsulating the names. I just want the movie names separated by "|".' 
    const result = await model.generateContent(message+formattedDictionary)
    const response = await result.response;
    const text = response.text()
    console.log(text)

    const bannedString = /\[\n/
    const bannedString2 = /\[/
    const bannedString3 = /\'|/

    while (bannedString.test(text) || bannedString2.test(text) || bannedString3.test(text)) {
        const message2 = 'Give me this informantion in JavaScript array format, without genres, numbers, or single/double quotations encapsulating the names. I just want the movie names separated by "|".' 
        const result2 = await model.generateContent(message+text)
        const response2 = await result.response;
        const text = response.text()
        console.log(text)
    } 

    
    return text
}
giveMovieSuggestionsBasedOnMovieList()


// Testing if the outputs of giveMovieSuggestionsBasedOnMovieList() can be used as input for movie search:
