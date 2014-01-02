require('angular');
require('angular-route');

var jobsApp = angular.module('viffservice/jobs',['ngRoute']);

jobsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'JobListCtrl',
    templateUrl: '/templates/jobs/index.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

jobsApp.factory('Jobs', ['$http', function($http) {
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

jobsApp.controller('JobListCtrl', [
  '$scope',
  'Jobs',
  function ($scope, Jobs) {
    $scope.jobList = [];

    Jobs.all(function(err, jobs) {
      $scope.jobList = jobs;
    });

    $scope.joblistClick = function () {
      console.log('123');
    };
  }
]);

