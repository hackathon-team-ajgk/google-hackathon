const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const API_READ_ACCESS_TOKEN = process.env.API_READ_ACCESS_TOKEN;
const { json } = require("express");
const fetch = require('node-fetch');