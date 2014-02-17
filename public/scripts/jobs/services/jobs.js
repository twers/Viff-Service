var JobsModule = require('jobs');

module.exports = ['JobsResource', function(JobsResource) {
  var Jobs = JobsModule.Jobs(JobsResource);
  return Jobs;
}];
