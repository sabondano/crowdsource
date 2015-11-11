var socket = io();

socket.on('connect', function () {
  console.log('You have connected!');
});

$('.send-message').click(function () {
  socket.send('message', {
    username: $('.username input[type=text]').val(),
    text: $('.message input[type=text]').val()
  });
});

var $messages = $('.messages');

socket.on('new connection', function (message) {
  console.log('Something came along on the "new connection" channel:', message);
  $messages.append(`<p>${message}</p>`);
});

socket.on('message', function (message) {
  console.log('Something came along on the "message" channel:', message);
  $messages.append(`<p><strong>${message.username}:</strong> ${message.text}</p>`);
});
