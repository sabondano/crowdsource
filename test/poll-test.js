const assert = require('assert');
const Poll = require('../lib/poll');

describe('Poll', function () {
  it('accepts a js object with poll data and host', function () {
    data = { pollData: { question: "To be or not to be?",
                         choices: ["yes", "no"] },
             host: "localhost:3000"
    };
    var poll = new Poll(data);

    assert.equal(data.pollData.question, poll.question);
    assert.equal(data.pollData.choices, poll.choices);
  });

  it('creates a unique id if none is passed in', function () {
    data = { pollData: { question: "To be or not to be?",
                         choices: ["yes", "no"] },
             host: "localhost:3000"
    };
    var poll1 = new Poll(data);
    var poll2 = new Poll(data);

    assert.equal("String", poll1.id.constructor.name);
    assert.notEqual(poll1.id, poll2.id);
  });

  it('creates an admin id when instantiated', function () {
    data = { pollData: { question: "To be or not to be?",
                         choices: ["yes", "no"] },
             host: "localhost:3000"
    };
    var poll = new Poll(data);

    assert.equal("String", poll.adminId.constructor.name);
  });

  it('has votes', function () {
    data = { pollData: { question: "To be or not to be?",
                         choices: ["yes", "no"] },
             host: "localhost:3000"
    };
    var poll = new Poll(data);

    assert.deepEqual({}, poll.votes);
  });

  it('has a link for the poll and an admin link', function () {
    data = { pollData: { question: "To be or not to be?",
                         choices: ["yes", "no"] },
             host: "localhost:3000"
    };
    var poll = new Poll(data);

    assert(poll.link);
    assert(poll.adminLink);
  });
});
