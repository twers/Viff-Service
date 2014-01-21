angular
  .module('viffservice/filters')
  .filter('timeAgo',
    function () {
      return function(time) {
        var periods = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade'];
        var lengths = ['60', '60', '24', '7', '4.35', '12', '10'];
        var now = Date.now();
        var difference = (now - time) / 1000;
        var i = 0;

        for(; difference >= lengths[i] && i < lengths.length; i++) {
          difference /= lengths[i];
        }

        difference = Math.round(difference);

        if(difference != 1) {
          periods[i] += 's';
        }

        return difference + ' ' + periods[i] + ' ago';
      };
    }
  );
