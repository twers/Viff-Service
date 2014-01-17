require('angular');
require('angular-route');
require('./jobs');
require('./builds');
require('./templates');

angular
  .module("viffservice", [
    'viffservice/jobs',
    'viffservice/builds',
    'viffservice/templates'
  ])
  .factory("viff", function(){
    return "viff";
  });
