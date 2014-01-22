
'use strict';

var jobModule = require('../../jobs');
var jobCruder = require('../../database')('jobs', require('../../jobs/job-cruder'));
var run = require('../../runner');
var Jobs = jobModule.Jobs(jobCruder);

module.exports = {
  index: function (req, res) {
    Jobs.findBuilds(req.param('id'), function (ex, builds) {
      if(ex) {
        return res.send(500);
      }
      res.send(200, builds);
    });
  },
  
  run: function (req, res) {
    var jobId = req.param("jobId");
    run(jobId, function() {
    });
    res.send(200);
  }
};
