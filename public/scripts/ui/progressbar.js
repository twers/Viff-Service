angular.module('viffservice/ui/progressbar', [])

.directive('progressbar', function() {


  return {
    restrict: 'EA',
    replace: true,
    templateUrl: '/templates/ui/progressbar/progressbar.html',
    scope: {
      type: '@',
      percentage: '=',
      transAnimate: '='
    },
    link: function(scope, element, attrs) {
      console.log(scope, element, attrs);


    }
  };

});
