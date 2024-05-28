# Uh...

## Prerequisites for running locally

- Node.js (v20.12.2)
- npm (10.5.0)

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
<!-- - CodeMirror -->
<!-- - React-Toastify -->

## Running Locally

1. Clone this repository
2. Initialize the database
    - Create a new MongoDB database
    - Import the .json files located in the database folder as collections according to their appropriate file names
2. Initialize the backend
    - Open a terminal in the backend folder
    - Run `npm install` to install the dependencies
    - Create .env file in the backend folder and copy paste the content of example.env, and add necessary credentials.
    - To start the server run `npm start`
    - To stop the server, press `Ctrl+c`
3. Initialize the frontend