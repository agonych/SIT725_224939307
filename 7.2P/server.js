const path = require('path'); // Importing path module
const http = require('http'); // Importing http module
const express = require('express'); // Importing express module
const { Server } = require('socket.io'); // Importing Server class from socket
const registerChatHandlers = require('./chat'); // Importing chat handlers

const app = express(); // Creating an express application
const server = http.createServer(app); // Creating an HTTP server
const io = new Server(server); // Creating a Socket.IO server
registerChatHandlers(io); // Registering chat handlers
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files from 'public' directory

const PORT = 3000; // Defining the port number

// Starting the server
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

