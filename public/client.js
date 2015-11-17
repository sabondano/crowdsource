var socket = io();

var connectionCount = document.getElementById('connection-count');
var pollId = document.getElementById('poll').dataset.id;
var buttons = document.querySelectorAll('#choices button');
var btnEndPoll = document.getElementById('btn-end-poll');
var tally = document.getElementById('tally');
var statusMessage = document.getElementById('status-message');

socket.send('joinRoom', pollId);
socket.send('getVotes', pollId);

socket.on('userConnection', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

socket.on('setVotes', function (message) {
  var voteCount = message.voteCount;
  var votes = message.votes;
  var choices = message.choices;

  if (Object.keys(votes).length > 0) {

    Object.keys(voteCount).forEach(function (vote) {
      var voteTd = $('#' + vote + 'Count');
      voteTd.text(voteCount[vote]);
    });
  }   
});

var voteCastListener = function () {
  socket.send('voteCast', {pollId: pollId, vote: this.innerText});
};

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', voteCastListener);
}

if (btnEndPoll) {
  btnEndPoll.addEventListener('click', function () {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeEventListener('click', voteCastListener);
    }    
    socket.send('turnPollOff', {pollId: pollId});
  });
}

socket.on('voteCount', function (message) {
  var votes = message.votes;
  var choices = message.choices;

  console.log(votes);

  if (!!tally) { 

    choices.forEach( function (choice) {
      var choiceTd = $('#' + choice + 'Count');
      choiceTd.text('0');
    });

    Object.keys(votes).forEach(function (vote) {
      $('#' + vote + 'Count').text(votes[vote]);
    });

  }
});
