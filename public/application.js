var socket = io();

socket.on('connect', function () {
  console.log('You have connected!');
});

$('.send-message').click(function () {
  socket.send('message', {
    username: $('.username').text,
    text: $('.message').text
  });
});

var $messages = $('.messages');

socket.on('message', function (message) {
  console.log('Something came along on the "message" channel:', message);
  $messages.append(`<p><strong>${message.user}:</strong> ${message.text}</p>`);
});
