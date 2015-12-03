const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const _ = require('lodash');

const client = require('./redis-client');
const Poll = require('./poll');

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
  res.render('pages/links-show', {poll: newPoll});
});

app.get('/polls/:id', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    if (obj[req.params.id] === undefined) {
      return res.send(`No poll with id ${req.params.id} found.`);
    }
    
    var poll = new Poll(JSON.parse(obj[req.params.id]), 'existingPoll');
    if (moment() > poll.endTime) {
      poll.status = "off";
      client.hmset('polls', poll.id, JSON.stringify(poll));
    }
    res.render('pages/poll-show', {poll: poll});
  });
});

app.get('/polls/:id/admin', function (req, res) {
  client.hgetall('polls', function (err, obj) {
    for (poll in obj) {
      var parsedPoll = JSON.parse(obj[poll]);
      if (parsedPoll.adminId === req.params.id) {
        var instantiatedPoll = new Poll(parsedPoll, 'existingPoll');
        if (moment() >= instantiatedPoll.endTime) {
          poll.status = "off";
          client.hmset('polls', poll.id, JSON.stringify(poll));
        }
        return res.render('pages/admin/poll-show', {poll: instantiatedPoll});
      } 
    }
    res.send(`No poll with id ${req.params.id} found.`);
  });
});

module.exports = app;
