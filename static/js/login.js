import api from './APIClient.js';

document.getElementById('login-btn').addEventListener('click', login);

// Redirect to main page after successful login
function login() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    api.login(username, password).then(() => {
        document.location = "./main"
    })
    .catch(error => {
        console.error('Login failed:', error);
    });
}
