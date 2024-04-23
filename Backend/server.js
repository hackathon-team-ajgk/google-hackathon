// THIS IS THE MOST UP TO DATE AND FUNCTIONAL VERSION
// Run server and test with "requests.rest" file from top to bottom. Final request should return "Success" if working correctly.

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Need connection to JSON DB (mongo? firebase?) for this to fully save I think... could try with React localStorage or sessionStorage. Replace with empty array when setup
const users = [
  {
    username: "John",
    password: "12345",
    movieData: {
      movie1: {
        title: "sample_Movie Title",
        rating: 5,
        dateAdded: "2021-01-01",
      },
      movie2: {
        title: "sample_Movie Title",
        rating: 5,
        dateAdded: "2021-01-01",
      },
    },
  },
];

// Get all users (from JSON DB)
app.get("/users", (req, res) => {
  res.json(users);
});

// Register a user. PUT OTHER METRICS IN USER OBJECT!!!
app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      username: req.body.username,
      password: hashedPassword,
      movieData: req.body.movieData,
    }; // ADD MORE METRICS HERE!!
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

// Login a user
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) {
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

// Start server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

/* 
TO DO:
- More error handling (more detailed error messages)
- Input validation
- More security (should be fine???)
*/
