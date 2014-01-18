'use strict';

describe('time ago filter', function () {

  var ago, current, currentStub;

  before(function () {
    current = Date.now();
    currentStub = sinon.stub(Date, 'now').returns(current);
  });

  after(function () {
    currentStub.restore();
  });

  beforeEach(module('viffservice/filters'));

  beforeEach(inject(['timeAgoFilter', function (timeAgo) {
    ago = timeAgo;
  }]));

  it('should return 1 second ago', function () {
    ago(current - 1001).should.equal('1 second ago');
  });

  it('should return 5 seconds ago', function () {
    ago(current - 5001).should.equal('5 seconds ago');
  });

  it('should return 5 minutes ago', function () {
    var time = 5 * 60 * 1000 - 1;
    ago(current - time).should.equal('5 minutes ago');
  });

  it('should return 5 hours ago', function () {
    var time = 5 * 60 * 60 * 1000 - 1;
    ago(current - time).should.equal('5 hours ago');
  });

  it('should return 5 days ago', function () {
    var time = 5 * 60 * 60 * 24 * 1000 - 1;
    ago(current - time).should.equal('5 days ago');
  });

  it('should return 2 weeks ago', function () {
    var time = 2 * 60 * 60 * 24 * 7 * 1000 - 1;
    ago(current - time).should.equal('2 weeks ago');
  });

  it('should return 5 months ago', function () {
    var time = 5 * 60 * 60 * 24 * 7 * 4.35 * 1000 - 1;
    ago(current - time).should.equal('5 months ago');
  });

  it('should return 5 years ago', function () {
    var time = 5 * 60 * 60 * 24 * 7 * 4.35 * 12 * 1000 - 1;
    ago(current - time).should.equal('5 years ago');
  });

  it('should return 5 decades ago', function () {
    var time = 5 * 60 * 60 * 24 * 7 * 4.35 * 12 * 10 * 1000 - 1;
    ago(current - time).should.equal('5 decades ago');
  });

});
