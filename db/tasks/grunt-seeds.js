'use strict';

module.exports = function dbSeeds(grunt) {
  grunt.registerTask('db:seed', 'seed prepared data', function () {

    /*
     TODO: this code is not clean

     cruder should be hidden in Jobs,
     otherwise we should inject cruder in Jobs and require database file everywhere
     */

    var database = require('../../lib/database');
    var jobCruder = database('jobs', require('../../lib/jobs/job-cruder'));
    var Jobs = require('../../lib/jobs/jobs')(jobCruder);
    var done = this.async();

    var build = { id: '1', status: "success", createdTime: Date.now() };
    var build2 = { id: '2', status: "failure", createdTime: Date.now() };

    Jobs.create({
      name: 'demo job',
      description: 'this is a demo job',
      config: '/upload/test.config.js'
    }, function (ex, job) {
      if (ex) {
        throw ex;
      }

      Jobs.addBuild(job.get('_id'), build, function () {
        Jobs.addBuild(job.get('_id'), build2, function () {
          console.log('Done. 1 job with 2 builds created.');
          done();
        });
      });

    });
  });
};