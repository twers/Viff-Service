require('angular');
require('angular-resource');

angular
  .module('viffservice/jobs/JobsFactory', ['ngResource'])
  .factory('Jobs', ['$http', function($http) {
    return {
      all: function(fn) {
        return $http.get('/jobs')
          .success(function(data) {
            fn(null, data);
          })
          .error(function(err) {
            fn(err);
          });
      }
    };
  }]);
