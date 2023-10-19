"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

var _require = require('./Data/data'),
    chats = _require.chats;

var connectDB = require('./config/database');

var userRoutes = require('./routes/userRoutes');

var chatRoutes = require('./routes/chatRoutes');

var messageRoutes = require('./routes/messageRoutes');

var _require2 = require('./middlewares/errorMiddleware'),
    notFound = _require2.notFound,
    errorHandler = _require2.errorHandler;

var path = require('path');

dotenv.config();
var app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.get('/api/chat', function (req, res) {
  res.send(chats);
});
app.get('/api/chat/:id', function (req, res) {
  var singleChat = chats.find(function (c) {
    return c._id === req.params.id;
  });

  if (singleChat) {
    res.send(singleChat);
  } else {
    res.status(404).send('Chat not found');
  }
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes); // --------------------------------- PRODUCTION DEPLOYMENT -----------------------------------

var __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  var buildPath = path.join(__dirname1, 'client/build');
  app.use(express["static"](buildPath));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
} else {
  app.get('/', function (req, res) {
    res.send('API RUNNING SUCCESSFULLY');
  });
} // ----------------------------------------------------------------------------------------------


app.use(notFound);
app.use(errorHandler);
var PORT = process.env.PORT;
var server = app.listen(PORT, function () {
  console.log("Listening on http://localhost:".concat(PORT));
});

var io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

io.on("connection", function (socket) {
  console.log("Connected to socket.io");
  socket.on("setup", function (userData) {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", function (room) {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", function (room) {
    return socket["in"](room).emit("typing");
  });
  socket.on("stop typing", function (room) {
    return socket["in"](room).emit("stop typing");
  });
  socket.on("new message", function (newMessageRecieved) {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(function (user) {
      if (user._id == newMessageRecieved.sender._id) return;
      socket["in"](user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", function () {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});