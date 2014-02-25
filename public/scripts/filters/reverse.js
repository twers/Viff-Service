angular
  .module('viffservice/filters')
  .filter('reverse',
    function () {
      return function(items) {
        return items.slice().reverse();
      };
    }
  );
