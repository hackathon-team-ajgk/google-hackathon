// NOT UP TO DATE... uses ejs

// Initialize Express.js Application
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt')

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

// Dummy user database (replace with actual database later) 
// NOTE: PASSWORD COMPARISONS WONT WORK UNLESS YOU ENCRYPT IT FIRST
const users = [
    { id: 1, username: 'user1', password: 'password1', movieLists: [] },
    { id: 2, username: 'user2', password: 'password2', movieLists: [] }
];

app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
function authenticate(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// Routes for user authentication
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received username:', username);
    console.log('Received password:', password);
    const user = users.find(u => u.username === username);
    console.log('Found user:', user);

    if (!user) {
        console.log("No users with that username")
        return res.status(401).send('Invalid username');
    }

    // Use bcrypt to compare hashed password
    // DOESNT WORK ATM BC USER PASSWORD IN DUMMY DB IS NOT ENCRYPTED
    bcrypt.compare(password, user.password, (err, result) => {
        console.log(password)
        console.log(user.password)
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(result)
        
        if (result) {
            // Passwords match, create a new object with only necessary user information
            const sessionUser = { id: user.id, username: user.username };
            req.session.user = sessionUser;
            return res.json({ message: 'Login successful' });
        } else {
            // Passwords don't match
            return res.status(401).send('Invalid password');
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Add user with hashed password to the database
        const newUser = { id: users.length + 1, username, password: hashedPassword, movieLists: [] };
        users.push(newUser);

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Routes for movie lists
app.get('/api/movies', authenticate, (req, res) => {
    const user = req.session.user;
    res.json(user.movieLists);
});

app.post('/api/movies', authenticate, (req, res) => {
    const user = req.session.user;
    const newMovieList = req.body;
    user.movieLists.push(newMovieList);
    res.status(201).json(newMovieList);
});

// Other CRUD routes (PUT, DELETE) can be implemented

// Testing Purposes
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

// Function to add a new user with hashed password
async function addUser(username, password) {
    try {
        // Generate a salt to hash the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Add the new user to the database with hashed password
        const newUser = { id: users.length + 1, username, password: hashedPassword, movieLists: [] };
        users.push(newUser);
        console.log(`User '${username}' added successfully with hashed password`);
    } catch (error) {
        console.error(`Error adding user: ${error.message}`);
    }
}

addUser('user3', 'password3');

// Start the server
app.listen(PORT, () => {
    console.log(`TEST Server is running on port ${PORT}`);
});
