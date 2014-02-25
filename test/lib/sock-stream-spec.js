var Mocker = require('../mocker');
var sinon = require('sinon');
var sockStream;

function fakeShoe() {
  var shoe = sinon.stub();
  var ret = sinon.stub();
  ret.install = sinon.stub();

  shoe.returns(ret);
  return {
    'shoe': shoe,
    'sock': ret
  };
}

function fakeApp() {
  return {};
}

describe('SockStream', function() {
  var shoe;
  var sock;
  beforeEach(function() {
    var mocker = new Mocker();
    var fakeShoeMod = fakeShoe();
    shoe = fakeShoeMod.shoe;
    sock = fakeShoeMod.sock;

    mocker.use('shoe', fakeShoeMod.shoe);
    mocker.use('./app', fakeApp());

    sockStream = mocker.require('lib/sock-stream.js').module.exports;
  });

  describe('#runStream', function() {
    it('should return the url of a specific jobid/buildid', function() {
      sockStream.runStream(0, 0).should.equal('/jobs/0/builds/0/stream');
    });

    it('should call the shoe\'s instance with app and the url', function() {
      var url = sockStream.runStream(0, 0);
      sock.install.calledWith({}, url).should.be.true;
    });
  });

});