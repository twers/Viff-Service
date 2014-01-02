require('angular');
require('angular-route');

require('./services/jobs.js');
require('./controllers/job-list');

var jobsApp = angular.module('viffservice/jobs',[
  'ngRoute',
  'viffservice/jobs/JobsFactory',
  'viffservice/jobs/JobListCtrl'
]);

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


