var jobs = require('../../lib/app');
var request = require('supertest');
var fs = require('fs');

describe('Jobs', function () {
 
 // remove uploads/configFile.json 
  before(function(done){
    fs.unlink('../../uploads/configFile.json',function(){
      done();
    });
  });

  it('should return 200 when post to /jobs ',function(done){
    request(jobs)
      .post('/jobs')
      .expect(200)
      .end(done);
  });

  it('should put attached file in %PROJECT_PATH/uploads from post /job', function(done){
    request(jobs)
      .post('jobs')
      .attach('configFile',  __dirname +'/configFile.json')
      .end(function() {
        fs.readFile('../../uploads/configFile.json',function(){
          done();
        });
      });
  });

});
