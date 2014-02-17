require('angular');
require('angular-route');

require('../builds');
var Jobs = require('./services/jobs');
var jobListCtrl = require('./controllers/job-list');
var jobDetailCtrl = require('./controllers/job-detail');

var jobsApp = angular.module('viffservice/jobs',[
  'ngRoute',
  'viffservice/builds'
]);


jobsApp.factory('Jobs', Jobs)
       .controller('JobListCtrl', jobListCtrl)
       .controller('JobDetailCtrl', jobDetailCtrl);

jobsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/jobs/:id', {
    controller: 'JobDetailCtrl',
    templateUrl: '/templates/jobs/show.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);


