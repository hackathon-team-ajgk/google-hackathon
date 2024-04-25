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
    try {
        const message = "Give me a list of ten movies in array format based on this genre without the year:  "
    
        //perform i/o validation 
        const result = await model.generateContent(message+userText)
        const response = await result.response;
        const text = response.text()
        console.log(text)
    
        return text
    } catch (error) {
        console.log("Error giving movie suggestions based on the genre: " + error)
    }
    

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
        console.error('Error reading user file:', error);
        throw error; // Re-throw the error to handle it outside this function
    }
}
// tallyGenreInMovieList()

// Make function that takes dictionary as input to gemini
async function giveMovieSuggestionsBasedOnMovieList() {
    try {
        const dictionary = await tallyGenreInMovieList()
        const formattedDictionary = JSON.stringify(dictionary)
        
        const message = 'Can you give 10 movie suggestions based on the two highest genres in this dictionary. Give me this informantion in the following format: [movie1|movie2|movie3|etc]' 
        const result = await model.generateContent(message+formattedDictionary)
        const response = await result.response;
        const text = response.text()

        // Formatting AI recommendations
        const regex = /\d+\./ //   \d+: Matches one or more digits and \. Matches a period
        finalText = text.replace('[', '').replace(']', '').replace(regex, '').split('|')
        finalText.forEach(movie => console.log(movie)) // For testing only

        // Checking for unwanted formatting or values (to be implemented)
        console.log()
        console.log("\nThe last movie in the finalText is: " + finalText[9]) // IMPORTANT FOR ERROR HANDLING (to be implemented). This gives "undefined" when error with dict, also is super long when dict somehow attaches to AI output. Can use length validation on last movie?
        
        return finalText

    } catch (error) {
        console.log("There was an error processing or getting recommendations from the movies in the movie list: " + error)
    }
}
giveMovieSuggestionsBasedOnMovieList()


/*
TODO:
- Output validation from AI response. Specifically, when there is an error with the dictionary. To test this,
  try removing the await from the first line after the 'try{' in the giveMovieSuggestionsBasedOnMovieList function
- Output validation for AI response in giveMovieSuggestionsBasedOnMovieList function. Run the function many times and 
  deal with (or decide that its safe not to) random characters and formatting that shouldnt be the way it is
- More I/O validation
- MORE OUTPUT validation. SUPER weird outputs sometimes recieved from AI in giveMovieSuggestionsBasedOnMovieList function
Ideas for this:
1. Make a function to test for checking unwanted formatting or values. Use a switch block to handle different scenarios and call another func to generate another response?
2. Max str length for each movie, movie cannot start/end with punctuation, movie cannot have asterisk. If any of these are true, trunkate movie and/or entire list
3. If any movie is "undefined", trunkate movie and/or entire list
- Think about optimization
- READ API USAGE LIMITS ON THE DOCUMENTATION. Make sure we have enough leeway for every potential user and for regenerating when invalid responses
 */