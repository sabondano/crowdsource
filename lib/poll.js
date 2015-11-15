const md5 = require('md5');
const _ = require('lodash');

function Poll (data, existingPollFlag) {
  if (existingPollFlag === undefined) {
    this.id        = Poll.createDigest(data.pollData);
    this.adminId   = Poll.createDigest(data.pollData);
    this.link      = Poll.buildLink({id: this.id, host: data.host});
    this.adminLink = Poll.buildAdminLink({id: this.adminId, host: data.host});
    this.question  = data.pollData.question;
    this.choices   = data.pollData.choices;
    this.votes     = {}; 
  } else {
    this.id        = data.id;
    this.adminId   = data.adminId;
    this.link      = data.link;
    this.adminLink = data.adminLink;
    this.question  = data.question;
    this.choices   = data.choices;
    this.votes     = data.votes; 
  }
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

Poll.prototype.countVotes = function () {
  return _.countBy(this.votes, function (vote, socketId) {
    return vote
  });
};

module.exports = Poll;
