const assert = require('assert');
const request = require('request');
const app = require('../server');
const redis = require('redis');
const client = redis.createClient();

const fixtures = require('./fixtures');
const Poll = require('../lib/poll');

describe('Server', () => {

  before((done) => {
    this.port = 9876;

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {

    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have a body with the name of the application', (done) => {
      var title = app.locals.title;

      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(title),
               `"${response.body}" does not include "${title}".`);
        done();
      });
    });

  });

  describe('POST /polls', () => {

    beforeEach(() => {
      client.flushall();
    });

    it('should not return 404', (done) => {
      this.request.post('/polls', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should receive and store data', (done) => {
      var payload = { poll: fixtures.validPoll };

      this.request.post('/polls', { form: payload }, (error, response) => {
        if (error) { done(error); }

        var pollCount = Object.keys(client.hgetall("polls")).length;
        client.hgetall('polls', function (err, obj) {
          var pollCount = Object.keys(obj).length;
          assert.equal(pollCount, 1, `Expected 1 poll, found ${pollCount}`);
        });

        done();
      });
    });

  });

  describe('GET /polls/:id', () => {

    it('should not return 404', (done) => {
      this.request.get('/polls/testPoll', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should return a page that has the question for the given poll', (done) => {
      var newPoll = new Poll({pollData: fixtures.validPoll, host: 'whateves'});
      client.hmset('polls', newPoll.id, JSON.stringify(newPoll));

      this.request.get('/polls/' + newPoll.id, (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(newPoll.question),
               `"${response.body}" does not include "${newPoll.question}".`);
               done();
      });
    });

  });

});
