const md5 = require('md5');

function Poll (data) {
  this.id = md5( JSON.stringify(data) + Date.now() );
}

module.exports = Poll;
