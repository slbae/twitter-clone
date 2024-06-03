// Fetch APIs from router.js

const API_BASE = '/api';

function checkResponse(res) {
    if (!res.ok) {
        throw new Error("There was an error in fetch");
    }
    return res;
}

function handleError(error) {
    console.log("ERROR", error);
    throw error;
}

function getFeed() {
    return fetch(API_BASE + '/feed')
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(feed => {
            return feed;
        })
        .catch(handleError);
}

function getUserById(userId) {
    return fetch(API_BASE + '/users/id/' + userId)
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(author => {
            return author;
        })
        .catch(handleError);
}

function createHowl(howlText, userId, username) {
    const requestData = {
        howlText: howlText,
        userId: userId,
        username: username
    };

    return fetch(API_BASE + '/howl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(checkResponse)
        .then(res => res.json())
        .then(howl => howl)
        .catch(handleError);
}

function getCurrentUser() {
    return fetch(API_BASE + '/authenticatedUser')
        .then(checkResponse)
        .then(res => {
            return res.json();
        })
        .then(user => {
            return user;
        })
        .catch(handleError);
}

function getUserByUsername(username) {
    return fetch(API_BASE + '/users/username/' + username)
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .then(user => {
        return user;
    })
    .catch(handleError);
}

function getUserFollowing(userId) {
    return fetch(API_BASE + '/following/' + userId)
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .then(following => {
        return following;
    })
    .catch(handleError);
}

function getHowlsByUserId(userId) {
    return fetch(API_BASE + '/howls/' + userId)
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .then(howls => {
        return howls;
    })
    .catch(handleError);
}

function getFollowing(userId) {
    return fetch(API_BASE + '/following/' + userId)
    .then(checkResponse)
    .then(res => {
        return res.json();
    })
    .then(following => {
        return following;
    })
    .catch(handleError);
}

function follow(userId) {
    return fetch(API_BASE + '/follow/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(checkResponse)
    .then(res => res.json())
    .then(following => following)
    .catch(handleError);
}

function unfollow(userId) {
    return fetch(API_BASE + '/unfollow/' + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(checkResponse)
    .then(res => res.json())
    .then(following => following)
    .catch(handleError);
    
}

export default {
    getFeed,
    getUserById,
    createHowl,
    getCurrentUser,
    getUserByUsername,
    getUserFollowing,
    getHowlsByUserId,
    getFollowing,
    follow,
    unfollow
};
