var socket = io();

var connectionCount = document.getElementById('connection-count');
var pollId = document.getElementById('poll').dataset.id;
var buttons = document.querySelectorAll('#choices button');
var btnEndPoll = document.getElementById('btn-end-poll');
var tally = document.getElementById('tally');
var statusMessage = document.getElementById('status-message');

socket.send('joinRoom', pollId);

socket.on('userConnection', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
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

socket.on('voteCount', function (votes) {
  console.log(votes);
  if (!!tally) { 
    Object.keys(votes).forEach(function (vote) {
      $('#' + vote + 'Count').text(votes[vote]);
    });
  }
});
