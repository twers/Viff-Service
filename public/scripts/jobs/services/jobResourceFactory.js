require('angular');
require('angular-resource');

angular
  .module('jobs/jobResourceFactory', ['ngResource'])
  .factory('jobsResource', ['$resource', function($resource) {
    return $resource('/jobs/:id', null, {
      create: { method: 'POST' },
      findById: { method: 'GET', params: { id: '@_id' } },
      update: { method: 'PUT', params: { id: '@_id' } },
      all: { method: 'GET' },
      remove: { method: 'DELETE', params: { id: '@_id' } }
    });
  }]);
