require('angular');
require('angular-route');

var appHome = angular.module('viffservice/home',['ngRoute']);

appHome.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'HomeJobListCtrl',
    templateUrl: '/templates/home/index.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);

appHome.factory('Jobs', ['$http', function($http) {
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

appHome.controller('HomeJobListCtrl', [
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

