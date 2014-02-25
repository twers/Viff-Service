'use strict';


module.exports = function dbClean(grunt) {
  grunt.registerTask('db:clean', 'clean the data in db', function() {

    var database = require('../../lib/database');
    var jobCruder = database('jobs');
    var done = this.async();

    jobCruder.drop(function (ex, result) {
      if (ex) { throw ex; }
      
      if (result) {
        console.log('Done. Have dropped db.jobs collection.');
        done();
      }
    });
  });
};
