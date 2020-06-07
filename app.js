// let's add dotenv to handle all environment variables in the app

const express = require("express"); // call in express
const app = express(); //creates an express application

//sets the template engine
app.set('viewengine', 'hbs');
// adds middleware to check status of the request-response cycle
const morgan = require('morgan');
app.use(morgan("dev"));

// this calls in http module and links it to the app
const http = require("http").Server(app);
const path = require("path"); // the path module is called
// calls in socket and links http server to it
const io = require("socket.io")(http);
// adds dotenv to the app
const dotenv = require("dotenv")
dotenv.config();
 //imports port from env file
const port = process.env.PORT || 3000; // creates a port
const uri= process.env.MONGO_URI;
const message = require("./server/message"); // requires the message.js file
const mongoose = require("mongoose"); // calls in mongoose
// db configuration 

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true }
  )  
.then(
  () => console.log('DB connected')) // connects mongoose to the uri

const db = mongoose.connection;
db.on('error',
 console.error.bind(console,'connection:error'));
 db.once('open', ()=>{
   console.log(`DB connected on ${port}`)
 });


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
