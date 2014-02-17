'use strict';

var ansi2html = require('ansi2html');

function console($rootScope, $log) {
  return {
    restrict: 'E',
    template: '<ul class="console"></ul>',
    scope: true,
    replace: true,
    link: function(scope, el) {

      $rootScope.$on('viff.console.event', function (event, data) {
        $log.debug(data);
        el.append('<li>' + ansi2html(data) + '</li>');
      });
      
    }
  };
}


module.exports = [
  '$rootScope',
  '$log',
  console
];
