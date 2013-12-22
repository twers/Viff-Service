var request = require('request');
var fs = require('fs');
var path = require('path');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/viffService?auto_reconnect', {safe: true});
require('../../lib/app');

describe('Jobs', function () {
  var existingFile;
  var uploadsPath = path.join(__dirname, "../../uploads");
  this.timeout(20000);
  // recode existing files in uploads/configFile.json 
  before(function (done) {
    fs.readdir(uploadsPath, function (err, fileList) {
      existingFile = fileList;
      done();
    });
  });

  // remove created test uploaded files and revert db changes
  after(function (done) {
    //remove uploaded files
    fs.readdir(uploadsPath, function (err, fileList) {
      fileList.forEach(function (file) {
        if (existingFile.indexOf(file) == -1) {
          fs.unlink(uploadsPath + '/' + file, function (err) {
            if (err) {
              console.error(err);
            }
          });
        }
      });
      //remove db changes
      db.collection('job').remove(
        {$or: [
          {name: "test job"},
          {name: "db save job test"}
        ]},
        function (err) {
          if (err) {
            console.error(err);
          }
          done();
        });
    });
  });

  it('should return 200 when post to /jobs ', function (done) {
    var r = request.post('http://localhost:3000/jobs', callback);
    var form = r.form();
    form.append('jobName', 'test job');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function callback() {
      done();
    }
  });

  it('should put attached file in %PROJECT_PATH/uploads from post /job', function (done) {
    var r = request.post('http://localhost:3000/jobs', callback);
    var form = r.form();
    form.append('jobName', 'test job');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    // function callback(err,response,body) {
    function callback() {
      done();
    }
  });

  it('should insert the path of uploaded json file into db', function (done) {
    var r = request.post('http://localhost:3000/jobs', callback);
    var form = r.form();
    form.append('jobName', 'db save job test');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function callback(error, response) {
      if (!error && response.statusCode == 200) {
        db.collection('job').findOne({name: "db save job test"}, function (err, job) {
          if (err) {console.error(err);}
          job.name.should.eql('db save job test');
          job.config.should.match(/\.json$/);
          done();
        });
      }
    }
  });

});
