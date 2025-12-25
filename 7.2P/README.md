# Socket.IO Chat

A real-time chat implementation with Express, Socket.IO, Materialize, and
jQuery. Users supply a display name, join the shared room, exchange messages,
and can exit without reloading. The server keeps an in-memory list of users 
and broadcasts join/leave/messages updates to everyone online.  

## Installation

Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Features

- Name prompt screen gates access to the chat and handles exits without a page refresh.
- Live user list that updates when participants join, leave, or disconnect.
- Socket.IO broadcasts relay chat messages and system events to every client in real time.

## Author

* Developed by **Andrej Kudriavcev**
* Student ID: **224939307**

