require('angular');
require('angular-resource');
require('angular-route');

var sockStreamService = require('./services/sock-stream');
var buildResource = require('./services/build-resource');
var buildEvent = require('./services/build-event');
var consoleDirective = require('./directives/console');
var buildListCtrl = require('./controllers/build-list');

angular
  .module('viffservice/builds', ['ngResource', 'ngRoute'])
  .factory('BuildEvent', buildEvent)
  .factory('SockStream', sockStreamService)
  .factory('Builds', buildResource)
  .directive('console', consoleDirective)
  .controller('BuildsListCtrl', buildListCtrl);


