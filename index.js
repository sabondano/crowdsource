const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const path = require('path');
const client = redis.createClient();

const bodyParser = require('body-parser');

const Poll = require('./lib/poll');

const pry = require('pryjs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/poll', function (req, res) {
  var newPoll = new Poll(req.body);
  var pollLink = `${req.headers.host}/${newPoll.id}`;
  res.send(`
      <p>You submited: ${req.body.question}<p>
      <p>Poll link: <a href="${pollLink}">${pollLink}</a></p>
      <p>Results link: <a href="${pollLink}/admin">${pollLink}/admin</a></p>
      `);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
