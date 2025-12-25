// Create a map object to store connected users
const users = new Map();

/* Helper function to broadcast the current user list to all clients */
const broadcastUserList = (io) => {
  io.emit('user-list', Array.from(users.values()));
};

/* Helper function to remove a user and broadcast the updated user list */
const removeUser = (io, socketId) => {
  const name = users.get(socketId);
  if (!name) {
    return null;
  }

  users.delete(socketId);
  broadcastUserList(io);

  return name;
};

/* function to register chat event handlers */
const registerChatHandlers = (io) => {
  // Handle new socket connections
  io.on('connection', (socket) => {

    // Handle 'join' event when a user joins the chat
    socket.on('join', (rawName) => {
      // Check if a name is given
      if (typeof rawName !== 'string') {
        return;
      }

      // Trim whitespace from the name
      const name = rawName.trim();

      // If no name is provided, send an error message back to the client
      if (!name) {
        socket.emit('system-message', {
          text: 'A display name is required to join the chat.',
          type: 'error',
        });
        return;
      }

      // If the user is already registered, ignore the join request
      if (users.has(socket.id)) {
        return;
      }

      // Register the user and broadcast the updated user list
      users.set(socket.id, name);
      broadcastUserList(io);

      // Notify all clients that a new user has joined
      io.emit('system-message', {
        text: `${name} joined the chat.`,
        type: 'info',
      });
    });

    // Handle 'chat-message' event when a user sends a message
    socket.on('chat-message', (rawMessage) => {
      // Ensure user name is given for this socket ID
      const name = users.get(socket.id);
      if (!name || typeof rawMessage !== 'string') {
        return;
      }

      // Ensure the message is not empty after trimming whitespace
      const message = rawMessage.trim();
      if (!message) {
        return;
      }

      // Broadcast the chat message to all clients
      io.emit('chat-message', {
        name,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle 'leave' event when a user leaves the chat
    socket.on('leave', () => {
      // Attempt to remove the user and get their name
      const name = removeUser(io, socket.id);
      if (!name) {
        return;
      }

      // Notify all clients that the user has left
      io.emit('system-message', {
        text: `${name} left the chat.`,
        type: 'info',
      });
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      // Attempt to remove the user and get their name
      const name = removeUser(io, socket.id);
      if (!name) {
        return;
      }

      // Notify all clients that the user has disconnected
      io.emit('system-message', {
        text: `${name} left the chat.`,
        type: 'info',
      });
    });
  });
};

module.exports = registerChatHandlers;

