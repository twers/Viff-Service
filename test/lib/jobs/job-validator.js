var request = require('request');
var fs = require('fs');

describe('post to /jobs validator',function(){

  it('should return 400 when name field is not legal', function(done) {
    var options = {
      url: 'http://localhost:3000/jobs',
      headers: {
        'Accept': 'application/json'
      }
    };
    var r = request.post(options, callback);
    var form = r.form();
    form.append('name', '');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function callback(err, response) {
      response.statusCode.should.equal(400);
      done();
    }    

  });

  it('should return 400 when file field is null', function(done) {
    var options = {
      url: 'http://localhost:3000/jobs',
      headers: {
        'Accept': 'application/json'
      }
    };
    var r = request.post(options, callback);
    var form = r.form();
    form.append('name', 'abc');

    function callback(err, response) {
      response.statusCode.should.equal(400);
      done();
    }    

  });

  it('should return 400 when upload file is not .json file', function(done) {
    var options = {
      url: 'http://localhost:3000/jobs',
      headers: {
        'Accept': 'application/json'
      }
    };
    var r = request.post(options, callback);
    var form = r.form();
    form.append('name', 'abc');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.haha'));

    function callback(err, response) {
      response.statusCode.should.equal(400);
      done();
    }    

  });

  it('should return 200 and JSON when post to /jobs ', function (done) {
    var options = {
      url: 'http://localhost:3000/jobs',
      headers: {
        'Accept': 'application/json'
      }
    };
    var r = request.post(options, callback);
    var form = r.form();
    form.append('name', 'test job');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function callback(err, response, body) {
      var job = JSON.parse(body);
      job.should.have.property('name','test job');
      done();
    }
  });
});
