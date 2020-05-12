
const express = require('express');// call in express
const app = express();//creates an express application
  const server = app.listen('3000')// shows what port our server is on
 const io = require('socket.io')(server);// calls in socket
 // let's create a middleware with express
 app.use(express.static('public'));
 // for the events 
 io.on('connection',(socket) =>{
     console.log('new user connected');
 //listen on change username
     socket.on('change_username', (data) =>{
         socket.username = data.username
     })
      //listen on new message
    socket.on('new_message', (data) =>{
        io.sockets.emit('new_message', {
            message: data.message, username : socket.username
        })
     //listen on typing
     socket.on('typing', (data) =>
     {socket.broadcast.emit('typing', {username: socket.username
    })
    //listen on stop typing
    socket.on('stop_typing', (data) => {
        socket.broadcast.emit('stop_typing', {username : socket.username})
    })
   
    })
    })
 }) ;
  