require('angular');
require('angular-route');
require('./jobs');
require('./builds');
require('./templates');
require('./filters');

angular
  .module("viffservice", [
    'viffservice/jobs',
    'viffservice/builds',
    'viffservice/filters',
    'viffservice/templates'
  ])
  .factory("viff", function(){
    return "viff";
  });
