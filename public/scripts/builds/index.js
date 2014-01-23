require('angular');
require('angular-resource');
require('angular-route');

var sockStreamService = require('./services/sock-stream');
var buildResource = require('./services/build-resource');
var buildListCtrl = require('./controllers/build-list');

angular
  .module('viffservice/builds', ['ngResource', 'ngRoute'])
  .factory('SockStream', sockStreamService)
  .factory('Builds', buildResource)
  .controller('BuildsListCtrl', buildListCtrl);


