require('angular');
require('angular-resource');

angular
  .module('viffservice/jobs/JobsResource', ['ngResource'])
  .factory('JobsResource', ['$resource', function($resource) {
    var jobsResource = $resource('/jobs/:id', null, {
      create: { method: 'POST' },
      show: { method: 'GET', params: { id: '@_id' } },
      update: { method: 'PUT', params: { id: '@_id' } },
      all: { method: 'GET' },
      remove: { method: 'DELETE', params: { id: '@_id' } }
    });

    jobsResource.removeById = function(id) {
      return this.remove({_id: id}); 
    };

    jobsResource.findById = function(id) {
      return this.show({_id: id});
    };

    return jobsResource;
  }]);
