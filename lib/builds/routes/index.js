'use strict';

var jobModule = require('../../jobs');
var jobCruder = require('../../database')('jobs', require('../../jobs/job-cruder'));
//var Job = jobModule.Job;
var Jobs = jobModule.Jobs(jobCruder);

module.exports = {

  index: function (req, res) {
    Jobs.findBuilds(req.param('id'), function (ex, builds) {
      res.send(200, builds);
    });
  }

};