let socket = io.connect('http://localhost:3000');

socket.on('typing', (data) =>{
    WebGLTransformFeedback.html('<p><i><b>' + data,username + "</b> is typing a message..."+ "</i>"
)});
//Listen on typing
socket.on('stop_typing', (data) =>{
    WebGLTransformFeedback.html("")
})