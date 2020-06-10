// all dependencies are called in here

const express = require("express"); //
const morgan = require('morgan');
const path = require("path");
const dotenv = require("dotenv")
dotenv.config();// adds dot-env to the app
const message = require("./models/message");
const mongoose = require("mongoose");
const app = express(); //creates an express application
const http = require("http").Server(app);
const io = require("socket.io")(http);
const errorHandler = require('errors');
//modules for authentication
const cors = require('cors')
const session = require('express-session');
const bodyParser = require('body-parser');

//sets the template engine
app.set('viewengine', 'hbs');

// app configuration
app.use(cors);
app.use(morgan("dev")); // sets morgan as the middleware to monitor requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'passport-chatapp', cookie: { maxAge: 6000 },
  resave: false, saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, "..", "client", "build"))); /* path
  module is used to point to the directory for our client side.*/


//imports port from env file
const port = process.env.PORT || 3000; // creates a port
const uri = process.env.MONGO_URI;

// db configuration 

mongoose.connect(process.env.MONGO_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
)
  .then(
    () => console.log('DB connected')) // connects mongoose to the uri

const db = mongoose.connection;
db.on('error',
  console.error.bind(console, 'connection:error'));
db.once('open', () => {
  console.log(`DB connected on ${port}`)
});



io.on("connection", (socket) => {
  console.log("new user connected");
  //listen on change username
  socket.on("change_username", (data) => {
    socket.username = data.username;
  });
  //listen on new message
  socket.on("new_message", (data) => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username,
    });
    //listen on typing
    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", {
        username: socket.username,
      });
      //listen on stop typing
      socket.on("stop_typing", (data) => {
        socket.broadcast.emit("stop_typing", { username: socket.username });
      });
    });
  });
});
