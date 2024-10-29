
# Install dependencies
$ npm install

# Running server
$ node app.js

The server listens at port 3000

# APIs

### User Model
{
username: "john_doe",
password: "securepassword",
dob: "1990-01-01",
image: "https://firebasestorage.googleapis.com/v0/b/upload-files-d3b42.appspot.com/o/upload-files%2Fimages%2Fblackmyth-1723969364570.jpg?alt=media&token=7d51fe27-e860-44c8-ae9e-b2d86dc31382"
}

### Post Model
{
id: 16939883939,
title: "My First Blog Post",
content: "This is the content of the post.",
createAt: "2024-09-08T12:00:00Z",
username: "john_doe",
status: "public",  // "public" or "private"
type: "technology"
}

### Like Model
{
id: 16939883939,
idPost: 16939883939,
username: "john_doe",
createAt: "2024-09-08T12:00:00Z"
}

# API Endpoints

### Register a User
POST http://localhost:3000/register

Request Body:
{
"username": "linda_ngo",
"password": "c05wf",
"dob": "1990-01-01"
}

### Login
POST http://localhost:3000/login

Request Body:
{
"username": "john_doe",
"password": "c05wf"
}


### Get Profile
GET http://localhost:3000/users/get-profile AUTH


### Update Profile
PUT http://localhost:3000/users/update-profile AUTH
{
    "dob": "1",
    "image": "https://firebasestorage.googleapis.com/v0/b/upload-files-d3b42.appspot.com/o/upload-files%2Fimages%2Fblackmyth-1723969364570.jpg?alt=media&token=7d51fe27-e860-44c8-ae9e-b2d86dc31382"
}

### Creating a Post
POST http://localhost:3000/posts AUTH

Request Body:
{
"title": "My First Blog Post",
"content": "This is the content of the post.",
"status": "public",  // "public" or "private"
"type": "technology"
}

### Getting all Posts
GET http://localhost:3000/posts Auth

### Getting a Post by ID
GET http://localhost:3000/posts/1 AUTH

### Updating a Post by ID
PUT http://localhost:3000/posts/1 AUTH

Request Body:
{
"title": "Updated Blog Post Title",
"content": "Updated content",
"status": "private",  // "public" or "private"
"type": "science"
}

### Deleting a Post by ID
DELETE http://localhost:3000/posts/1 AUTH

### Liking a Post
POST http://localhost:3000/posts/1/like AUTH

### Unliking a Post
POST http://localhost:3000/posts/1/unlike AUTH


### Getting all Likes for a Post
GET http://localhost:3000/posts/1/likes AUTH
