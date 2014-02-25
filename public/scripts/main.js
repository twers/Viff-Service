require('angular');
require('angular-route');
require('./jobs');
require('./builds');
require('./templates');

require('./ui/progressbar');

require('./filters');


angular
  .module("viffservice", [
    'viffservice/jobs',

    'viffservice/builds',
    'viffservice/filters',
    'viffservice/templates',
    'viffservice/ui/progressbar'



  ])
  .factory("viff", function(){
    return "viff";
  });
