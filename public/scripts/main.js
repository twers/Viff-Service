require('angular');
require('angular-route');
require('./jobs');
require('./builds');
require('./templates');

require('./ui/progressbar');

require('./filters');

require('./report');


angular
  .module("viffservice", [
    'viffservice/jobs',

    'viffservice/builds',
    'viffservice/filters',
    'viffservice/templates',
    'viffservice/ui/progressbar',
    'viffReport'
  ])
  .factory("viff", function(){
    return "viff";
  });
