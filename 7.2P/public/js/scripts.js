$(document).ready(function () {
  const socket = io();
  const nameScreen = $('#name-screen');
  const chatScreen = $('#chat-screen');
  const nameForm = $('#name-form');
  const nameInput = $('#name-input');
  const exitButton = $('#exit-button');
  const messagesList = $('#messages');
  const usersList = $('#users');
  const messageForm = $('#message-form');
  const messageInput = $('#message-input');
  let username = null;

  /** Scroll messages window to the bottom **/
  const scrollMessagesToBottom = () => {
    const element = messagesList.get(0);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  /** Format ISO date string to a human-readable time **/
  const formatTime = (isoString) => {
    // Ensure the the time is given
    if (!isoString) {
      return '';
    }

    try {
      // Use toLocaleTimeString to format the time according to user's locale
      return new Date(isoString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  };

  /** Append a new message to the messages list **/
  const appendMessage = (content) => {
    messagesList.append(content);
    scrollMessagesToBottom();
  };

    /** Render the list of active users **/
  const renderUsers = (users) => {
    // Clear the existing list
    usersList.empty();
    // Populate with the new users in a loop
    users.forEach((user) => {
      const item = $('<li>', { class: 'collection-item' });
      item.text(user);
      usersList.append(item);
    });
  };

  /** Show chat view **/
  const showChat = () => {
    nameScreen.addClass('hide');
    chatScreen.removeClass('hide');
    messageInput.focus();
    M.updateTextFields();
  };

  /** Show name input view **/
  const showNameScreen = () => {
    chatScreen.addClass('hide');
    nameScreen.removeClass('hide');
    nameInput.val('');
    renderUsers([]);
    // Update and focus the Materialize text field
    M.updateTextFields();
    nameInput.focus();
  };

  /** Join the chat with the given name **/
  const joinChat = (name) => {
    username = name;
    socket.emit('join', name);
    showChat();
  };

  /** Name input form submission handler **/
  nameForm.on('submit', (event) => {
    event.preventDefault();
    // Get the name of the user
    const name = nameInput.val().trim();
    // No name was given
    if (!name) {
      alert('Please provide your name to continue.');
      nameInput.focus();
      return;
    }
    // Name is given, join the chat
    joinChat(name);
  });

  /** Exit button click handler **/
  exitButton.on('click', () => {
    // Send a leave event to the server
    socket.emit('leave');
    // Clear the username and show the name input screen
    username = null;
    showNameScreen();
  });

  /** Message input form submission handler **/
  messageForm.on('submit', (event) => {
    event.preventDefault();
    // Must have a username to send messages
    if (!username) {
      return;
    }
    // Must have a non-empty message
    const text = messageInput.val().trim();
    if (!text) {
      return;
    }
    // Send the message to the server
    socket.emit('chat-message', text);
    messageInput.val('');
    // Update and focus the Materialize text field
    M.updateTextFields();
  });

  /** Chat message received from the server event handler **/
  socket.on('chat-message', ({ name, message, timestamp }) => {
    const item = $('<li>', { class: 'collection-item' });
    const container = $('<div>', { class: 'chat-message' });
    const messageText = $('<span>');
    messageText.append($('<strong>').text(name));
    messageText.append(document.createTextNode(`: ${message}`));
    const timeTag = $('<time>').text(formatTime(timestamp));
    container.append(messageText, timeTag);
    item.append(container);
    appendMessage(item);
  });

  /** System message received from the server event handler **/
  socket.on('system-message', ({ text, type }) => {
    if (type === 'error' && !username) {
      alert(text);
      return;
    }
    const item = $('<li>', {
      class: 'collection-item system-message',
    });
    item.text(text);
    appendMessage(item);
  });

  /** User list received from the server event handler **/
  socket.on('user-list', (users) => {
    renderUsers(users);
  });

  // Initially, focus the name input field
  nameInput.focus();
});


