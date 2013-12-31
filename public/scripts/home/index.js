require('angular');
require('angular-route');

var appHome = angular.module('viffservice/home',['ngRoute']);

function homeConfig($routeProvider) {
  $routeProvider.
    when('/', {
      controller: HomeJobList,
      templateUrl: '/templates/home/index.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}

appHome.config(homeConfig);

function HomeJobList($scope, $http) {
  $http.get('/jobs').success(function (data) {
    $scope.joblist = data;
  });
  $scope.joblistClick = function () {
    console.log('123');
  };
}

