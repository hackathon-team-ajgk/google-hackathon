// To get access to API key from .env:
// install 'dotenv', create .env file, place in key, require("dotenv").config

require("dotenv").config();
const API_KEY = process.env.GEMINI_API;

import {GoogleGenerativeAI as googleGen} from "@google/generative-ai";

const genAI = new googleGen(API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"})

