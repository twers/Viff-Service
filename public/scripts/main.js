require('angular');
require('angular-route');
require('./jobs');
require('./templates');

angular
  .module("viffservice", [
    'viffservice/jobs',
    'viffservice/templates'
  ])
  .factory("viff", function(){
    return "viff";
  });
