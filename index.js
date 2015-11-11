const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');

const path = require('path');
const client = redis.createClient();

const bodyParser = require('body-parser');

const pry = require('pryjs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/poll', function (req, res) {
  console.log('Poll received with ' + JSON.stringify(req.body));
  res.send('You submited ' + req.body.question + '.');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
