(function(){
  'use strict';

  // Initialize the WebSocket connection.
  var socket = io();

  // Grab some DOM element that we're going to be using.
  var createPollButton = $('#btn-create-poll');
  var pollForm = $('#poll-form');
  var answers = $('#answers');
  var addAnswerButton = $('#btn-add-answer');

  // Show form to create poll when #btn-create-poll is clicked.
  createPollButton.on('click', function (event) {
    event.preventDefault();
    createPollButton.hide();
    pollForm.show(); 
  });

  // Add answer field to form when #btn-add-answer is clicked.
  addAnswerButton.on('click', function (event) {
    event.preventDefault();
    answers.append(`<input type="text" name="answer"><br>`);
  });
}());
