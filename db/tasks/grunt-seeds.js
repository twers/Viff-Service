'use strict';

module.exports = function dbSeeds(grunt) {
  grunt.registerTask('db:seed', 'seed prepared data', function () {

    /*
     TODO: this code is not clean

     cruder should be hidden in Jobs,
     otherwise we should inject cruder in Jobs and require database file everywhere
     */

    var path = require('path');
    var q = require('q');
    var Jobs = require('../../lib/jobs/app').Jobs;
    var Builds = require('../../lib/builds/builds');
    var done = this.async();
    var build = { _id: 0, status: "success", createdTime: Date.now() };
    var build2 = { _id: 1, status: "failure", createdTime: Date.now() };
    var initReady = 2;

    Jobs.create({
      name: 'demo job',
      description: 'this is a demo job',
      config: path.join(__dirname, '../..', 'test/assets/configFile.js')
    }, function (ex, job) {
      if (ex) {
        throw ex;
      }

      Builds.create(job.get('_id'), build)
            .then(function() {
              return Builds.create(job.get('_id'), build2);
            })
            .then(function() {
              if(--initReady == 0) done();
              Jobs.create({
                name: 'demo job for edit',
                description: 'this is another demo job'
              }, function (ex, job) {
                if (ex) {
                  throw ex;
                }
                console.log('Done. 1 job without builds created.');
                if(--initReady == 0) done();
              });
            });
    });
  });
};
