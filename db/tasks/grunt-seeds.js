'use strict';

/* 
  TODO: this code is not clean

  cruder should be hidden in Jobs, 
  otherwise we should inject cruder in Jobs and require database file everywhere
*/

var database = require('../../lib/database');
var jobCruder = database('jobs', require('../../lib/jobs/job-cruder'));
var Jobs = require('../../lib/jobs/jobs')(jobCruder);

module.exports = function (grunt) {
  grunt.registerTask('db:seed', 'seed prepared data', function() {
    var done = this.async();

    Jobs.create({
      name: 'demo job',
      description: 'this is a demo job'
    }, function (ex, job) {
      if (ex) { throw ex; }
      console.log('Done. 1 job created.');
      done();
    });
  });
};