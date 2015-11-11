const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');

const path = require('path');
const client = redis.createClient();

app.use(express.static('public'));
var messageCount = 0;

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', function (socket) {
  console.log('Someone has connected.');
  socket.broadcast.emit("new connection", 'A new user has connected.');

  socket.on('message', function (channel, message) {
    console.log(channel + ':', message);
    io.sockets.emit(channel, message);
    var messageString = JSON.stringify({text: message.text});
    client.set('message ' + messageCount++, messageString);
  });

  socket.on('disconnect', function () {

  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
