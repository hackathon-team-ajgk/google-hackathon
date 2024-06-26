// THIS IS A SERVER IN DEVELOPMENT

const movieAPI = require("./movieApiHandler");
const express = require("express");
const app = express();
const session = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 10, // 10 second expiry FOR TESTING
    },
  })
);

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

// Middleware to check token validity
function authenticateToken(req, res, next) {
  const token = req.session.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@moviesitedb.dzkecdm.mongodb.net/MovieSiteDB`;

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

    app.post("/register", async (req, res) => {
      try {
        // Hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Insert the new user into the database
        const newUser = {
          username: req.body.username,
          password: hashedPassword,
          movieData: {
            watchedMovies: {
              movies: {},
            },
            watchLaterList: {
              movies: {},
            },
          },
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
          const accessToken = jwt.sign(
            { username: user.name },
            process.env.JWT_SECRET
          );
          const refreshToken = jwt.sign(
            { username: user.name },
            process.env.JWT_SECRET,
            "_refresh"
          );
          req.session.token = token; // Store the token in session
          req.session.refreshToken = refreshToken; // Store the refresh token in session
          res.send({ accessToken, refreshToken }); // Send tokens to the client
          console.log({ accessToken, refreshToken });
        } else {
          res.status(401).send("Incorrect password");
        }
      } catch {
        res.status(500).send();
      }
    });

    // Token refresh endpoint
    app.post("/refresh", (req, res) => {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
      }

      // Verify refresh token
      jwt.verify(refreshToken, JWT_SECRET + "_refresh", (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, {
          expiresIn: "10m",
        });
        res.json({ accessToken });
      });
    });

    // Logout endpoint to invalidate token
    app.post("/logout", (req, res) => {
      req.session.destroy();
      res.send("Logged out successfully");
    });

    app.get("/profile", authenticateToken, async (req, res) => {
      try {
        // Access user's information from the JWT payload
        const username = req.user.username;

        // Retrieve the user's data from DB, check if the user exists, send user data back
        const user = await usersCollection.findOne({ username });
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/getTrendingMovies", (req, res) => {
      movieAPI
        .getTrendingMovies()
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.status(500).send("Error fetching popular movies.", error);
        });
    });

    // Logout endpoint to invalidate token
    app.post("/logout", (req, res) => {
      req.session.destroy();
      res.send("Logged out successfully");
    });

    app.get("/profile", authenticateToken, async (req, res) => {
      try {
        // Access user's information from the JWT payload
        const username = req.user.username;

        // Retrieve the user's data from DB, check if the user exists, send user data back
        const user = await usersCollection.findOne({ username });
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Add other routes here...
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server after connecting to the database
const PORT = process.env.PORT || 3000;
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

/* 
TO DO:
- More error handling (more detailed error messages)
- Input validation
- JWT & session implementation
- https
*/
