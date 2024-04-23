const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const API_READ_ACCESS_TOKEN = process.env.GEMINI_API;
const { json } = require("express");
const fetch = require('node-fetch');

const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(API_READ_ACCESS_TOKEN)

const model = genAI.getGenerativeModel({model: "gemini-pro"})


async function giveMovieSuggestions(userText){
    
    const message = "Give me movies based on this genre without the year: "
    
    const result = await model.generateContent(message+userText)
    const response = await result.response;
    const text = response.text()
    console.log(text)

    return text
}
giveMovieSuggestions("Drama")
