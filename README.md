# Discodieren: A Discord-inspired Real-time Collaborative Editor 

## Introduction
Imagine a world where writing code is as easy as sending a message on Discord. Search no further! Inspired by Discord's interface and flow, we present you Discodieren, a code editor where you can work together and see your team's effort in real-time, allowing for a more direct and faster way of code collaboration.

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

## Setup the replica set

Prerequisites for replset setup
- mongodb
- mongosh

### Steps
Details on converting a standalone to a replica set is available on the [official tutorial](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/). Here's a quick rundown on what you'll need to do to set the replica set up
1. Shutdown standalone instance
    - Run `mongosh` to connect to your mmongod instance.
    - Switch to the admin database `use admin`
    - Shut the instance down `db.admin({shuwdown: 1, comment:"Convert to cluster"})`. You can now use `.exit` to exit mongosh

2. Edit the mongod.config in the on-startup MongoDB instance which is normally in this path:
`C:\Program Files\MongoDB\Server\7.0\bin`
    - Open the mongod.config and add:
    ```
    replication:
        replSetName: yourReplicaSetName
    ```

3. Create 2 more nodes
    - Create a folder with a data folder and 2 empty files: `mongod.cfg` and `mongod.log`
    - Paste the content of the mongod.cfg previously edited in the above section into this folder mongod.cfg file
    - Change the dbPath, the log path and port accordingly. Any port is okay, as long as all the nodes use different ports
    - Repeat these steps to create a second node

4. Connect all the nodes to create the replica set
    - `mongod --config <path/to/your/mongod.cfg>` is the command to run a repl set.
    - First you want to run the on-startup node first, the one in step 2
    - After that run `mongosh` in a different terminal to connect to the node
    - Run `rs.initiate()` to initiate the replica set
    - Now run the other 2 nodes
    - Run `rs.add({ host: "\<nodeIpAddress\>:\<nodePort\>" })`. Replace the `nodeIpAddress` and `nodePort` accordingly
    - In the mongosh terminal, run `rs.status()` to check. After a while it should be 1 `'PRIMARY'`, 2 `'SECONDARY'`.

5. Setup the .env file
    - Go to the backend folder and create a `.env` file. Read the `example.env` and edit the file content accordingly 
 
6. Intialize 
    - run `npm install` and `npm start` to start the server and connect it to the database

