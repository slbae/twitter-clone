const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');

// Middleware to parse JSON bodies
router.use(express.json());
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let currentUser = {
    "id": 1,
    "first_name": "Stu",
    "last_name": "Dent",
    "username": "student",
    "avatar": "https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1"
};

const follows = require('./data/follows.json');
const users = require('./data/users.json');
const howls = require('./data/howls.json');

// Routes

// Login is the first page: receive a username and verify that it corresponds to
// one of the existing users to grant access.
router.post('/api', (req, res) => {
    const username = req.body.username;
    // Get user with username
    const userFound = Object.values(users).find(user => user.username === username);
    req.session.user = userFound;
    if (userFound) {
        //currentUser = userFound; // Store current authenticated user
        // Need to provide the full path to the file rather than a relative path for sendFile
        const mainPath = path.join(__dirname, '../templates/main.html');
        // User is authenticated and sent to Howler main page
        res.sendFile(mainPath);
    }
    else {
        // Else User does not exist
        res.status(404).json({ error: "User not found" });
    }
});

// Getting the currently "authenticated" user's object.
router.get('/api/authenticatedUser', (req, res) => {
    res.json(req.session.user);
});

// Creating a new howl
router.post('/api/howl', (req, res) => {
    // Create a new Howl
    const newHowl = {
        id: howls.length + 1,
        userId: req.session.user.id,
        datetime: new Date(),
        text: req.body.howlText
    };

    // Add the new Howl
    howls.push(newHowl);
    // Respond with the new howl
    res.json(newHowl);
});

// Getting howls posted by a specific user
router.get('/api/howls/:userId', (req, res) => {
    // Get the user's id
    const userId = req.params.userId;
    // Get all the howls posted by the user
    const userHowls = howls.filter(howl => howl.userId === parseInt(userId));
    // Respon  d with the list of the howls the user posted
    res.json(userHowls);
});


// Getting howls posted by all users that the current user follows
router.get('/api/feed', (req, res) => {
    // Get the user's following list
    const following = follows[req.session.user.id].following;

    let feed = [];
    // Add howls to the feed if they were posted from the current user or
    // the users from its following list
    howls.forEach(item => {
        if (!feed.includes(item) && (following.includes(item.userId) || item.userId === req.session.user.id)) {
            feed.push(item);
        }
    });

    // Respond with the user's feed
    res.json(feed);
});

// Getting a specific user's object by their id
router.get('/api/users/id/:userId', (req, res) => {
    // Get the user with the given userId
    const user = users[req.params.userId];

    if (user) {
        // Respond with the user
        res.json(user);
    } else {
        // User does not exist
        res.status(404).json({ error: "UserId not found" });
    }
});

// Getting a specific user's object by their username
router.get('/api/users/username/:username', (req, res) => {
    // Get the user with the given username
    const user = Object.values(users).find(obj => obj.username === req.params.username);

    if (user) {
        // Respond with the user
        res.json(user);
    } else {
        // User does not exist
        res.status(404).json({ error: "UserName not found" });
    }
});

// Getting the list of users that a specific user follows
router.get('/api/following/:userId', (req, res) => {
    // Get the user's following list from follows.json
    const following = follows[parseInt(req.params.userId)].following;
    console.log(following);
    // Respond with the following list
    res.json(following);
});

// Follow a user by its id
router.post('/api/follow/:userId', (req, res) => {
    // Add the user with the given userId to the current user's following list
    follows[req.session.user.id].following.push(parseInt(req.params.userId));
    // Send the currentUser's new following list
    res.json(follows[req.session.user.id].following);
});

// Unfollow a user by its id
router.put('/api/unfollow/:userId', (req, res) => {
    // Find the index of the user to unfollow in the following array
    const index = follows[req.session.user.id].following.indexOf(parseInt(req.params.userId));
    // If the user is being followed, remove them from their following list
    if (index !== -1) {
        follows[req.session.user.id].following.splice(index, 1);
    }
    // Send the currentUser's new following list
    res.json(follows[req.session.user.id].following);
});

// Export routes
module.exports = router;
