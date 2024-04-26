// THIS IS THE MOST UP TO DATE AND FUNCTIONAL VERSION
// Run server and test with "requests.rest" file from top to bottom. Final request should return "Success" if working correctly.

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
app.use(express.json());

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@moviesitedb.dzkecdm.mongodb.net/MovieSiteDB`;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.send("No token")

  jwt.verify(token, process.env.JWT_SECRET, (err, body) => {
    if (err) return res.send("Unverified token")
    req.user = body
    console.log(req.user)
    next() 
  })

} 

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the MongoDB server
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Use the appropriate database and collection
    const db = client.db("MovieSiteDB");
    const usersCollection = db.collection("users");

    // Define routes after the connection is established
    // Testing feature to get all users in DB
    app.get("/user", authenticateToken, async (req, res) => {
      try {
        // Retrieve all users from the database
        console.log(req.user.username) // Should be name of whatever you signed in as
        const users = await usersCollection.find().toArray();
        res.json(users.filter(user => user.username === req.user.username));
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/allUsers", async (req, res) => {
      try {
        // Retrieve all users from the database
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
      }
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

    app.post("/login", async (req, res) => {
      const user = await usersCollection.findOne({
        username: req.body.username,
      });
      if (user === null) {
        return res.status(400).send("Cannot find user");
      }
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const username = req.body.username 
          const user = {username: username}
          const accessToken = jwt.sign(user, process.env.JWT_SECRET)
          console.log(accessToken) 
          res.send("Success")
        } else {
          res.status(401).send("Incorrect password");
        }
      } catch {
        res.status(500).send();
      }
    });

    app.put('/edit-movie-state', authenticateToken, async (req, res) => {
      try {
          const { username, action, movie } = req.body;
  
          if (!username || !action || !movie) {
              return res.status(400).send("Missing required fields");
          }
  
          // Retrieve the user from the database
          const user = await usersCollection.findOne({ username });
          if (!user) {
              return res.status(404).send("User not found");
          }
  
          // Update the movie state based on the action
          if (action === "watch" || action === "watch-later") {
              // Determine which list to update
              const listToUpdate = action === "watch" ? "watchedMovies" : "watchLaterList";
  
              // Add the movie to the specified list
              user.movieData[listToUpdate][movie.title] = movie;
  
              // Update the user document in the database
              await usersCollection.updateOne(
                  { username },
                  { $set: { movieData: user.movieData } }
              );
  
              res.send(`Movie '${movie.title}' added to '${listToUpdate}' successfully`);
          } else {
              res.status(400).send("Invalid action");
          }
      } catch (error) {
          console.error("Error updating movie state:", error);
          res.status(500).send("Internal Server Error");
      }
  });

    // Add other routes here...
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}


// Start the server after connecting to the database
const PORT = 3000;
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
});

/* 
TO DO:
- More error handling (more detailed error messages)
- Input validation
- More security (should be fine???)
*/
