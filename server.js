const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const path = require('path');
const client = redis.createClient();

const bodyParser = require('body-parser');
const _ = require('lodash');

const pry = require('pryjs');

const Poll = require('./lib/poll');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.locals.title = 'Crowdsource'

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/polls', function (req, res) {
  if (!req.body.poll) { return res.sendStatus(400); }

  var newPoll = new Poll({pollData: req.body.poll, host: req.headers.host});
  client.hmset('polls', newPoll.id, JSON.stringify(newPoll));
  res.send(`
           <p>You submited: ${req.body.poll.question}<p>
           <p>Poll link: <a href="${newPoll.link}">${newPoll.link}</a></p>
           <p>Results link: <a href="${newPoll.adminLink}">${newPoll.adminLink}</a></p>
           `);
});

app.get('/polls/:id', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    if (obj[req.params.id] === undefined) {
      return res.send(`No poll with id ${req.params.id} found.`);
    }
    
    var poll = new Poll(JSON.parse(obj[req.params.id]), 'existingPoll');
    res.render('pages/poll-show', {poll: poll});
  });
});

app.get('/polls/:id/admin', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    for (poll in obj) {
      var parsedPoll = JSON.parse(obj[poll]);
      if (parsedPoll.adminId === req.params.id) {
        var instantiatedPoll = new Poll(parsedPoll, 'existingPoll');
        return res.render('pages/admin/poll-show', {poll: instantiatedPoll});
      } 
    }
    res.send(`No poll with id ${req.params.id} found.`);
  });
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      client.hgetall('polls', function (err, obj) {
        var poll = new Poll(JSON.parse(obj[message.pollId]), 'existingPoll');
        poll.votes[socket.id] =  message.vote;
        client.hmset('polls', poll.id, JSON.stringify(poll));
        io.sockets.emit('voteCount', poll.countVotes());
        socket.emit('statusMessage', `We received your vote for ${message.vote}!`);
      });
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

if (!module.parent) {
  http.listen(process.env.PORT || 3000, function(){
    console.log('Your server is up and running on Port 3000. Good job!');
  });
}

module.exports = app;
