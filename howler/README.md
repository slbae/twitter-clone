1. An interesting challenge you encountered when implementing Howler. What was the issue, and how did you solve it?

I had finished the functionality of all the pages but was testing with multiple browsers open and realized the browsers would switch to the same current user. I solved this issue by implementing user sessions so that the current user would be unique to the session. The data would be saved as long as the server was running and both sessions could access the same data even though they would be logged in as different users.

2. What additional feature would you add to Howler, and how would you suggest it should be implemented?

I would add a like and comment functionality to make it more similar to a social media app. This would be similar to implementing the following list and howl list. I would make a global variable to store the list of likes and comments and map them to their howl ids and the user that liked/commented. I would create initial json data for that like the howls.json and follows.json files.

