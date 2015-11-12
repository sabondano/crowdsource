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

app.post('/polls', function (req, res) {
  var newPoll = new Poll(req.body);
  client.hmset('polls', newPoll.id, JSON.stringify(newPoll));
  var pollLink = `${req.headers.host}/polls/${newPoll.id}`;
  res.send(`
      <p>You submited: ${req.body.question}<p>
      <p>Poll link: <a href="http://${pollLink}">${pollLink}</a></p>
      <p>Results link: <a href="http://${pollLink}/admin">${pollLink}/admin</a></p>
      `);
});

app.get('/polls/:id', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    var poll = JSON.parse(obj[req.params.id]);
    res.send(`
        <p>${poll.question}</p>
        <p>${poll.answers[0]}</p>
        <p>${poll.answers[1]}</p>
        `);
  });
});

app.get('/polls/:id/admin', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    var poll = JSON.parse(obj[req.params.id]);
    res.send(`
        <p>${poll.question}</p>
        <p>${poll.answers[0]}</p>
        <p>${poll.answers[1]}</p>
        `);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
