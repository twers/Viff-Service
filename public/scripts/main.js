require('angular');
require('angular-route');
require('./home');
require('./templates');

angular
  .module("viffservice", [
    'viffservice/home',
    'viffservice/templates'
  ])
  .factory("viff", function(){
    return "viff";
  });
