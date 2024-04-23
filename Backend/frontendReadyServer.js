// THIS IS THE MOST UP TO DATE VERSION
// UNTESTED. REQUIRES FRONTEND CONNECTION TO TEST

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(express.json());

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

async function connectToDatabase() {
  const { MongoClient } = require("mongodb");
  // MongoDB connection URI. MAKE SURE TO REPLACE ADMIN AND PASSWORD WITH ENV VARS
  const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@moviesitedb.dzkecdm.mongodb.net/MovieSiteDB`;
  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Use the appropriate database and collection
    const db = client.db("MovieSiteDB");
    const usersCollection = db.collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function loginHandler() {
  // Starting and connecting to DB
  const PORT = process.env.PORT || 3000;
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

  app.post("/login", async (req, res) => {
    const user = await usersCollection.findOne({ username: req.body.username });
    if (user === null) {
      return res.status(400).send("Cannot find user");
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.send("Success");
      } else {
        res.status(401).send("Incorrect password");
      }
    } catch {
      res.status(500).send();
    }
  });
}

async function registerHandler() {
  // Starting and connecting to DB
  const PORT = process.env.PORT || 3000;
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

  app.post("/register", async (req, res) => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Insert the new user into the database
      const newUser = {
        username: req.body.username,
        password: hashedPassword,
        movieData: req.body.movieData,
      };
      await usersCollection.insertOne(newUser);
      res.status(201).send("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}

// Connect to the MongoDB server
async function getAllUsersHandler() {
  try {
    const PORT = process.env.PORT || 3000;
    connectToDatabase().then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    });

    // Testing feature to get all users in DB
    app.get("/users", async (req, res) => {
      try {
        // Retrieve all users from the database
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Add other routes here...
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

/* 
TO DO:
- More error handling (more detailed error messages)
- Input validation
- More security (should be fine???)
*/
