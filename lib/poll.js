const md5 = require('md5');

function Poll (data) {
  this.id = md5( JSON.stringify(data) + Date.now() );
  this.question = data.question;
  this.answers = data.answers;
}

module.exports = Poll;
