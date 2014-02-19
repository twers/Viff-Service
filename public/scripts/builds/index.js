require('angular');
require('angular-resource');
require('angular-route');

var sockStreamService = require('./services/sock-stream');
var buildResource = require('./services/build-resource');
var buildEvent = require('./services/build-event');
var generalWatcher = require('./services/build-general-watcher');
var consoleDirective = require('./directives/console');
var runBtnDirective = require('./directives/run-button');
var buildListCtrl = require('./controllers/build-list');

angular
  .module('viffservice/builds', ['ngResource', 'ngRoute'])
  .factory('GeneralWatcher', generalWatcher)
  .factory('BuildEvent', buildEvent)
  .factory('SockStream', sockStreamService)
  .factory('Builds', buildResource)
  .directive('console', consoleDirective)
  .directive('runButton', runBtnDirective)
  .controller('BuildsListCtrl', buildListCtrl);


