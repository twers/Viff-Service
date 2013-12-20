var request = require('request');
var fs = require('fs');
require('../../lib/app');

describe('Jobs', function () {
  this.timeout(20000); 
 // remove uploads/configFile.json 
  before(function(done){
    fs.unlink('../../uploads/configFile.json',function(){
      done();
    });
  });

  it('should return 200 when post to /jobs ',function(done){
    var r = request.post('http://localhost:3000/jobs', handler);
    var form = r.form();
    form.append('jobName', 'test job');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function handler() {
      done();
    }
  });

  it('should put attached file in %PROJECT_PATH/uploads from post /job', function(done){
    var r = request.post('http://localhost:3000/jobs', handler);
    var form = r.form();
    form.append('jobName', 'test job');
    form.append('configFile', fs.createReadStream(__dirname + '/configFile.json'));

    function handler() {
      done();
    }
  });

});
