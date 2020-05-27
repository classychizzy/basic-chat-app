// let's add dotenv to handle all environment variables in the app

const express = require('express');// call in express
const app = express();//creates an express application
const http = require('http').Server(app);// this calls in http module and links it to the app
const path = require('path');// the path module is called
const io = require('socket.io')(http);// calls in socket and links http server to it
const uri = process.env.MongoDB_URI// creates uri that is stored as an environment variable
const port = process.env.port // creates a port
const message = require("./message") // requires the message.js file
const mongoose = require('mongoose') // calls in mongoose

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}); // connects mongoose to the uri

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));/* path
  module is used to point to the directory for our client side.*/
  
io.on('connection', (socket) => {
    console.log('new user connected');
    //listen on change username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })
    //listen on new message
    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {
            message: data.message, username: socket.username
        })
        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {
                username: socket.username
            })
            //listen on stop typing
            socket.on('stop_typing', (data) => {
                socket.broadcast.emit('stop_typing', { username: socket.username })
            })

        })
    })
});
