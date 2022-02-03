const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

//creating an instance of an express app
const app = express();//receive http requests, Listening on a port

//create an endpoint for an http client to request -> http://localhost:3000
app.get('/', (req, res)=>{
    res.sendFile('chat.html', { root:__dirname }); //the path to the folder of the executing file
});

//port to run the server and to listen on
const httpServer = http.createServer(app).listen(3000);

//taking the web server and enhancing it with socketio functionality
const io = socketIO(httpServer);

//event!!!
io.on('connection', socket =>{
    console.log('Client Connected');

    //send back a message to the newly connected client
    socket.emit('welcome', 'Welcome from chat server');
       
    //capture when the client disconnects
    //Capture the total number of clients on the server when disconnected
    socket.on('disconnect', (total)=> {
        console.log('Client Disconnected');
        io.emit('total', io.engine.clientsCount);
    });
    
    //capture when a message arrives from the client
    socket.on('message', message => {
        console.log(message);
        //send message to all clients
        io.emit('message', message);
    });

    //Capture the total number of clients on the server when connected
    io.emit('total', io.engine.clientsCount);
    
});


//broadcast out the time every second to all connected clients 
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

