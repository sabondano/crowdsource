(function(){
  'use strict';

  // Grab some DOM elements that we're going to be using.
  var createPollButton = $('#btn-create-poll');
  var pollForm = $('#poll-form');
  var choices = $('#choices');
  var addChoiceButton = $('#btn-add-choice');

  // Show form to create poll when #btn-create-poll is clicked.
  createPollButton.on('click', function (event) {
    event.preventDefault();
    createPollButton.hide();
    pollForm.show(); 
  });

  // Add answer field to form when #btn-add-answer is clicked.
  addChoiceButton.on('click', function (event) {
    event.preventDefault();
    choices.append(`<input type="text" name="poll[choices]"><br>`);
  });

}());
