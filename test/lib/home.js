var request = require('supertest');
var home = require('../../lib/app');

describe('Home Page', function () {

  it('should response 200 from home page', function(done) {
    request(home)
      .get('/')
      .expect(200)
      .end(done);
  });
});