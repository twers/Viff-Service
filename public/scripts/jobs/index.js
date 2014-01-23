require('angular');
require('angular-route');

require('./services/jobs-resource');
require('./services/jobs');
require('./controllers/job-list');

var jobsApp = angular.module('viffservice/jobs',[
  'ngRoute',
  'viffservice/jobs/JobsResource',
  'viffservice/jobs/JobsFactory',
  'viffservice/jobs/JobListCtrl'
]);

require('./controllers/job-detail');

jobsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'JobListCtrl',
    templateUrl: '/templates/jobs/index.html'
  }).
  when('/jobs/:id', {
    controller: 'JobDetailCtrl',
    templateUrl: '/templates/jobs/show.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);


