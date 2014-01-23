require('angular');
require('angular-resource');

var JobsModule = require('jobs');

angular
  .module('viffservice/jobs/JobsFactory', [])
  .factory('Jobs', ['JobsResource', function(JobsResource) {
    var Jobs = JobsModule.Jobs(JobsResource);
    return Jobs;
  }]);
