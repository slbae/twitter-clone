import api from './APIClient.js';

let currentUser;

// Pad zero to single digit numbers
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Get month name from month index
function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
}

// Format time to 12-hour format
function formatTime(hours) {
    return hours % 12 || 12; // If hours is 0, it should be 12 AM, else display hours in 12-hour format
}

// Get AM or PM
function getAmPm(hours) {
    return hours < 12 ? 'am' : 'pm'; // If hours is less than 12, it's AM, else it's PM
}

// Renders the given howl
async function renderHowl(howl) {
    const feedContainer = document.getElementById('feed-container');

    // Convert datetime to a formatted string (Month, Day, Year, Time)
    const dateTime = new Date(howl.datetime);
    const formattedDateTime = `${getMonthName(dateTime.getMonth())} ${dateTime.getDate()}, ${dateTime.getFullYear()}  ${formatTime(dateTime.getHours())}:${padZero(dateTime.getMinutes())}${getAmPm(dateTime.getHours())}`;

    // Create a container for the howl
    const howlElement = document.createElement('div');
    howlElement.classList.add('howl');

    // Get author information
    const author = await api.getUserById(howl.userId);
    const authorUsername = author.username;
    const authorFullName = `${author.first_name} ${author.last_name}`;

    // Create an anchor element for the user's avatar
    const avatarLink = document.createElement('a');
    avatarLink.href = `/profile?searchUser=${encodeURIComponent(authorUsername)}`;
    const avatar = document.createElement('img');
    avatar.src = author.avatar;
    avatar.classList.add('avatar');

    // Append the avatar to the avatar link
    avatarLink.appendChild(avatar);

    // Create elements for author's name and username
    const authorNameElement = document.createElement('a');
    authorNameElement.textContent = `${authorFullName}`;
    authorNameElement.classList.add('author-name');
    authorNameElement.href = `/profile?searchUser=${encodeURIComponent(authorUsername)}`;

    const usernameElement = document.createElement('a');
    usernameElement.textContent = `@${authorUsername}`;
    usernameElement.classList.add('username');
    usernameElement.href = `/profile?searchUser=${encodeURIComponent(authorUsername)}`;

    // Create element for the date
    const dateElement = document.createElement('div');
    dateElement.textContent = `${formattedDateTime}`;
    dateElement.classList.add('date');

    // Create element for the howl text
    const textElement = document.createElement('div');
    textElement.textContent = howl.text;
    textElement.classList.add('howl-text');

    // Add all elements of the howl
    howlElement.appendChild(avatarLink);
    howlElement.appendChild(authorNameElement);
    howlElement.appendChild(usernameElement);
    howlElement.appendChild(dateElement);
    howlElement.appendChild(textElement);

    // Add howl to feed container, new howls will be rendered as the first howl
    if (feedContainer.firstChild) {
        feedContainer.insertBefore(howlElement, feedContainer.firstChild);
    } else {
        feedContainer.appendChild(howlElement);
    }
}


// Fetch and render the current user's profile icon on nav bar of the main page
function renderProfile() {
    // Fetch current user's information
    api.getCurrentUser()
        .then(user => {
            currentUser = user;
            // Create elements for user's profile picture and username
            const avatar = document.createElement('img');
            avatar.src = currentUser.avatar;
            avatar.classList.add('rounded-circle', 'mx-2');

            const username = document.createElement('span');
            username.textContent = `@${currentUser.username}`;
            username.classList.add('text-light');

            // Append elements to the user-info container
            const userInfoContainer = document.getElementById('user-info');
            userInfoContainer.appendChild(username);
            userInfoContainer.appendChild(avatar);

            // Add link to the current user's profile
            userInfoContainer.href = '/profile?searchUser=' + currentUser.username;
        })
}

// Render sorted feed and profile on nav bar
document.addEventListener('DOMContentLoaded', async function () {
    // Load profile icon on nav bar
    renderProfile();

    // Render the current user's feed in reverse chronological order
    const feed = await api.getFeed();
    const sortedFeed = feed.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    for (const howl of sortedFeed) {
        await renderHowl(howl);
    }
});

// Create a new howl and render it in the feed container
document.getElementById('howlForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the howl text from the form input
    let howlText = document.getElementById('howlText').value;

    // Create new howl
    api.createHowl(howlText, currentUser.id, currentUser.username)
        .then(newHowl => {
            // After creating the new howl, render it
            renderHowl(newHowl);

            // Clear the howl textbox
            document.getElementById('howlText').value = '';
    });

});

// Go to the searched username's profile page when searchForm is submitted
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('searchUser').value;
    window.location.href = `/profile?searchUser=${encodeURIComponent(username)}`;
});
