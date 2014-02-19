angular.module('viffReport')
  .filter('imagePath', function () {
    return function(input){
      return encodeURIComponent(input);
    };
  })
  .filter('browserFilter', function (){
    return function(input){
      return "(" + input[0].toUpperCase() + ")" + input.slice(1);
    };
  })
  .filter('showCases', function(){
    return function(cases, showAll){
      var arrayToReturn = []; 
      if(showAll){
        angular.forEach(cases, function(item){
          if (item.misMatchPercentage >= 0) {
            arrayToReturn.push(item);
          }
        });
      } else {
        angular.forEach(cases, function(item){
          if (item.misMatchPercentage > 0) {
            arrayToReturn.push(item);
          }
        });
      }
      return arrayToReturn;
    };
  });