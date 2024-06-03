import api from './APIClient.js';

let profileId;

// Get month name from month index
function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
}

// Format time to 12-hour format
function formatTime(hours) {
    return hours % 12 || 12; // If hours is 0, it should be 12 AM, else display hours in 12-hour format
}

// Pad zero to single digit numbers
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Get AM or PM
function getAmPm(hours) {
    return hours < 12 ? 'am' : 'pm'; // If hours is less than 12, it's AM, else it's PM
}

// Render the profile information of the user
function renderProfileInfo(searchUser) {
    const profileInfoContainer = document.getElementById('profile-info');
    // Render profile picture
    const profilePicElement = document.createElement('img');
    profilePicElement.src = searchUser.avatar;
    profilePicElement.alt = `Profile Picture`;
    profilePicElement.classList.add('pic');
    profileInfoContainer.appendChild(profilePicElement);

    // Render full name
    const fullNameElement = document.createElement('p');
    fullNameElement.textContent = `${searchUser.first_name} ${searchUser.last_name}`;
    fullNameElement.classList.add('full-name');
    profileInfoContainer.appendChild(fullNameElement);

    // Render username
    const usernameElement = document.createElement('p');
    usernameElement.textContent = `@${searchUser.username}`;
    usernameElement.classList.add('profile-username');
    profileInfoContainer.appendChild(usernameElement);

    // Reorder follow button as the last child
    const followButton = document.getElementById('follow-btn');
    profileInfoContainer.appendChild(followButton);
}

// Render howls that the user created in reverse chronological order
async function getHowls(searchUser) {
    const howls = await api.getHowlsByUserId(searchUser.id);
    const sortedHowls = howls.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    for (const howl of sortedHowls) {
        await renderHowl(howl);
    }
}

// Render the given howl
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

    // Create image element for the author's profile picture
    const profilePicElement = document.createElement('img');
    profilePicElement.src = author.avatar;
    profilePicElement.alt = authorUsername;
    profilePicElement.classList.add('avatar');

    // Create elements for author's name and username
    const authorNameElement = document.createElement('p');
    authorNameElement.textContent = `${authorFullName}`;
    authorNameElement.classList.add('author-name');

    const usernameElement = document.createElement('p');
    usernameElement.textContent = `@${authorUsername}`;
    usernameElement.classList.add('username');

    // Create element for the date
    const dateElement = document.createElement('p');
    dateElement.textContent = `${formattedDateTime}`;
    dateElement.classList.add('date');

    // Create element for the howl text
    const textElement = document.createElement('div');
    textElement.textContent = howl.text;
    textElement.classList.add('howl-text');

    // Add all elements of the howl
    howlElement.appendChild(profilePicElement);
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
        .then(currentUser => {
            // Create elements for user's profile picture and username
            const avatar = document.createElement('img');
            avatar.src = currentUser.avatar;
            avatar.classList.add('rounded-circle', 'mx-2');

            const username = document.createElement('span');
            username.textContent = `@${currentUser.username}`;
            username.classList.add('text-light');

            // Append elements to the user-info container
            const userInfoContainer = document.getElementById('user-info');

            // Append elements to the user-info container
            userInfoContainer.appendChild(username);
            userInfoContainer.appendChild(avatar);

            // Add link to the current user's profile
            userInfoContainer.href = '/profile?searchUser=' + currentUser.username;
        })
}

// Renders the following list, clicking on a follower will redirect to their profile page
function renderFollowing(searchUser) {
    // Get container to render the followers
    const followingListContainer = document.getElementById('following-list');

    // Clear existing content in the following list container
    followingListContainer.innerHTML = '';

    // Get the searchedUser's following list
    api.getUserFollowing(searchUser.id).then(following => {
        // Iterate over the list of userIds searchUser follows
        following.forEach(userId => {
            // Create a list item element for each followed user
            const listItem = document.createElement('li');

            // Get the user by their id
            api.getUserById(userId).then(user => {
                // Create an anchor element for the user's profile
                const userLink = document.createElement('a');
                userLink.classList.add('dropdown-item');
                userLink.textContent = `${user.first_name} ${user.last_name} @${user.username}`;
                userLink.href = `/profile?searchUser=${encodeURIComponent(user.username)}`;

                // Create an anchor element for the user's avatar
                const avatarLink = document.createElement('a');
                avatarLink.href = `/profile?searchUser=${encodeURIComponent(user.username)}`;
                const avatar = document.createElement('img');
                avatar.src = user.avatar;
                avatar.classList.add('avatar');

                // Append the avatar to the avatar link
                avatarLink.appendChild(avatar);

                // Append the avatar link and user link to the list item
                listItem.appendChild(avatarLink);
                listItem.appendChild(userLink);

                // Append the list item to the following list container
                followingListContainer.appendChild(listItem);
            });
        });
    });
}

// Load page content
document.addEventListener('DOMContentLoaded', async function () {
    // Get the current URL
    const url = window.location.href;

    // Parse the URL to extract the query parameters
    const urlParams = new URLSearchParams(new URL(url).search);

    // Get the value of the searchUser parameter
    const searchUsername = urlParams.get('searchUser');

    // Render page content
    await api.getUserByUsername(searchUsername).then(searchUser => {
        profileId = searchUser.id;
        renderProfile();
        setFollowBtn(profileId);
        renderProfileInfo(searchUser);
        renderFollowing(searchUser);
        getHowls(searchUser);
    });

    // Follow/unfollow the profile user
    const followButton = document.getElementById('follow-btn');
    followButton.addEventListener('click', () => updateFollow(profileId));
});

// Renders the follow button based in if the current user follows the profile user or not
function setFollowBtn(profileId) {
    const followButton = document.getElementById('follow-btn');
    // Get the current user
    api.getCurrentUser()
        .then(currentUser => {
            // Check if the profileId is the same as the current user's ID
            if (profileId === currentUser.id) {
                // If it is, hide the follow button
                followButton.style.display = 'none';
                return;
            }
            // Determine if the current user follows the profile user or not
            api.getUserFollowing(currentUser.id).then(following => {
                if (following.includes(profileId)) {
                    // Current user is already following the profile, unfollow option
                    followButton.textContent = 'Unfollow';
                } else { // Else, follow option
                    followButton.textContent = 'Follow';
                }
            });
        });
}

// Handles follow/unfollow whenever follow-btn is clicked
function updateFollow(profileId) {
    // Update follow button text content
    const followButton = document.getElementById('follow-btn');
    // Get the current user
    api.getCurrentUser()
        .then(currentUser => {
            // Update followBtn to say Follow or Unfollow based on if the current user follows the profile user or not
            api.getUserFollowing(currentUser.id).then(following => {
                if (following.includes(profileId) && followButton.textContent === 'Unfollow') {
                    // Current user is already following the profile, unfollow option
                    unfollowUser(profileId);
                    followButton.textContent = 'Follow';
                } else { // Else, follow option
                    followUser(profileId);
                    followButton.textContent = 'Unfollow';
                }
            });
        });
}

// Handles following the profile user
function followUser(userId) {
    // Get the current user
    api.getCurrentUser()
        .then(currentUser => {
            // Follow the profile user if not following already
            api.getUserFollowing(currentUser.id).then(following => {
                if (!following.includes(userId)) {
                    api.follow(userId).then(followingList => {
                        following = followingList;
                    });
                }
            });
        });
}

function unfollowUser(userId) {
    // Get current user
    api.getCurrentUser()
        .then(currentUser => {
            // Unfollow the profile user if following already
            api.getUserFollowing(currentUser.id).then(following => {
                if (!following.includes(userId)) {
                    console.log("Cannot unfollow user");
                }
                else {
                    api.unfollow(userId).then(followingList => {
                        following = followingList;
                    });
                }
            });
        });
}
