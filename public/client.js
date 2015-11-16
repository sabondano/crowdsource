var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('userConnection', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

var pollId = document.getElementById('poll').dataset.id;
var buttons = document.querySelectorAll('#choices button');

var voteCastListener = function () {
  socket.send('voteCast', {pollId: pollId, vote: this.innerText});
};

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', voteCastListener);
}

var btnEndPoll = document.getElementById('btn-end-poll');

if (btnEndPoll) {
  btnEndPoll.addEventListener('click', function () {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeEventListener('click', voteCastListener);
    }    
    socket.send('turnPollOff', {pollId: pollId});
  });
}

var tally = document.getElementById('tally');

socket.on('voteCount', function (votes) {
  console.log(votes);
  if (!!tally) { tally.innerText = JSON.stringify(votes); }
});
