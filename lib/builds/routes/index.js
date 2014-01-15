'use strict';

var jobModule = require('../../jobs');
var jobCruder = require('../../database')('jobs', require('../../jobs/job-cruder'));
var Jobs = jobModule.Jobs(jobCruder);

module.exports = {

  index: function (req, res) {
    Jobs.findBuilds(req.param('id'), function (ex, builds) {
      if(ex) {
        return res.send(500);
      }
      res.send(200, builds);
    });
  }

};