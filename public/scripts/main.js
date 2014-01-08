require('angular');
require('angular-route');
require('./jobs');
require('./templates');
require('./showcase');

angular
  .module("viffservice", [
    'viffservice/jobs',
    'viffservice/templates',
    'viffservice/showcase'
  ])
  .factory("viff", function(){
    return "viff";
  });
