const app = require('./lib/routes');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');

const client = require('./lib/redis-client');
const Poll = require('./lib/poll');

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'joinRoom') {
      socket.join(message);
    }
  });

  socket.on('message', function (channel, message) {
    if (channel === 'getVotes') {
      client.hgetall('polls', function (err, obj) {
      var poll = new Poll(JSON.parse(obj[message]), 'existingPoll');
      var voteCount = poll.countVotes();
      var votes = poll.votes;
      var choices = poll.choices;
      socket.emit('setVotes', { votes: votes, voteCount: voteCount, choices: choices });
      });
    }
  });

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      client.hgetall('polls', function (err, obj) {
        var poll = new Poll(JSON.parse(obj[message.pollId]), 'existingPoll');
        if (moment() >= poll.endTime) {
          poll.status = "off";
          client.hmset('polls', poll.id, JSON.stringify(poll));
        }
        if (poll.status === "on") {
          poll.votes[socket.id] =  message.vote;
          client.hmset('polls', poll.id, JSON.stringify(poll));
          io.to(poll.id).emit('voteCount',
                              { votes: poll.countVotes(), choices: poll.choices });
          socket.emit('statusMessage', `We received your vote for ${message.vote}!`);
        }
        if (poll.status === "off") {
          socket.emit('statusMessage', `Sorry but this poll has been turned off.`);
        }
      });
    }

    if (channel === 'turnPollOff') {
      client.hgetall('polls', function (err, obj) {
        var poll = new Poll(JSON.parse(obj[message.pollId]), 'existingPoll');
        poll.status = "off";
        client.hmset('polls', poll.id, JSON.stringify(poll));
        socket.emit('statusMessage', `The poll has been turned off.`);
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
