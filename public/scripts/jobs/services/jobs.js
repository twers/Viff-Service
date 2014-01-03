require('angular');
require('angular-resource');

var JobsModule = require('jobs');

angular
  .module('viffservice/jobs/JobsFactory', [])
  .factory('Jobs', ['JobsResource', function(cruder) {
    var Jobs = JobsModule.Jobs(cruder);
    return Jobs;
  }]);
