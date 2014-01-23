require('angular');
require('angular-resource');


angular
  .module('viffservice/jobs/JobsResource', ['ngResource'])
  .factory('JobsResource', ['$resource', function($resource) {
    var jobsResource = $resource('/jobs/:id', null, {
      create: { method: 'POST' },
      show: { method: 'GET' },
      update: { method: 'PUT', params: { id: '@id' } },
      all: { method: 'GET', isArray: true },
      remove: { method: 'DELETE' }
    });

    jobsResource.removeById = function(id) {
      return this.remove({id: id});
    };

    jobsResource.findById = function(id, fn) {
      return this.show({id: id}, fn);
    };

    return jobsResource;
  }]);
