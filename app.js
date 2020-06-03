// let's add dotenv to handle all environment variables in the app

const express = require("express"); // call in express
const app = express(); //creates an express application
//sets the template engine
app.set('viewengine', 'hbs');
// this calls in http module and links it to the app
const http = require("http").Server(app); 
const path = require("path"); // the path module is called
 // calls in socket and links http server to it
 const io = require("socket.io")(http);
 // adds dotenv to the app
 const dotenv= require("dotenv").config();
const uri = process.env.MongoDB_URI; // creates uri that is stored as an environment variable
const port = process.env.port||3000; // creates a port
const message = require("./server/message"); // requires the message.js file
const mongoose = require("mongoose"); // calls in mongoose
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6}//handles promises in the mongoose connection
};
mongoose.connect("uri", "options").then(
    ()=>{}

) // connects mongoose to the uri

app.use(
  express.static(path.join(__dirname, "..", "client", "build"))
); /* path
  module is used to point to the directory for our client side.*/

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
