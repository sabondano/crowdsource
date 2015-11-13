const md5 = require('md5');

function Poll (data) {
  this.id        = Poll.createDigest(data.pollData);
  this.adminId   = Poll.createDigest(data.pollData);
  this.link      = Poll.buildLink({id: this.id, host: data.host});
  this.adminLink = Poll.buildAdminLink({id: this.id, host: data.host});
  this.question  = data.pollData.question;
  this.choices   = data.pollData.choices;
  this.answers   = [];
}

Poll.createDigest = function (data) {
  return md5( JSON.stringify(data) + Date.now() + Math.random() );
};

Poll.buildLink = function (data) {
  return `http://${data.host}/polls/${data.id}`;
};

Poll.buildAdminLink = function (data) {
  return `http://${data.host}/polls/${data.id}/admin`;
};


module.exports = Poll;
