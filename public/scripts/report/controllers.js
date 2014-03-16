angular.module('viffReport', [])
  .controller('reportCtrl', ['dataService', '$scope', function (dataService, $scope) {
    var key = window.key;

    function init(results, diffCount, caseCount, totalAnalysisTime, browsers) {
      $scope.totalAnalysisTime = totalAnalysisTime;
      
      $scope.caseCount = caseCount;
      $scope.sameCount = caseCount - diffCount;
      $scope.cases = results;
      $scope.browsers = browsers;
      $scope.showAll = true;
      $scope.search = {
        browser: browsers[0],
        url: '',
      };

      function resetCurrentCases(){
        $scope.currentBrowserCases = filter($scope.cases, function(viffCase){ 
          return viffCase.browser == $scope.search.browser && viffCase.url.indexOf($scope.search.url) >=0;
        });
        $scope.currentCases = $scope.currentBrowserCases;
        $scope.currentViff = $scope.currentBrowserCases[0];
        $scope.currentViffId = $scope.currentViff.id;  
      }

      $scope.diffCount = function(){
        var count = 0;
        angular.forEach($scope.cases, function (item) {
          if(item.misMatchPercentage !== 0) {
            count = count + 1;
          }
        });
        return count;
      };

      $scope.$watch('showAll', function(newVal){
        // newVal false means show only diff;
        // newVal true means show all
        if(newVal === false){
          $scope.currentBrowserCases = filter($scope.cases, function(viffCase){
            return viffCase.isSameDimensions == newVal;
          });  
          $scope.currentCases = $scope.currentBrowserCases;
          $scope.currentViff = $scope.currentBrowserCases[0];
          $scope.currentViffId = $scope.currentViff.id;  
        }else {
          resetCurrentCases();
        }
      });

      $scope.$watch('currentViffId', function (newVal) {
        $scope.currentViff = filter($scope.currentCases, function (viffCase) {
          return viffCase.id == newVal;
        })[0];
        angular.forEach($(".envImages img, .diffImage img"), function(img){
          img.src = "image/loader.gif";
        });
        setTimeout(function(){          
          $(".envImages img, .diffImage img").unveil();
        }, 5);
        
      });

      $scope.$watch('search.browser', function () {
        resetCurrentCases();
      });

      $scope.$watch('search.url', function (newVal) {
        $scope.currentCases = filter($scope.currentBrowserCases, function(viffCase) {
          return viffCase.url.indexOf(newVal) >= 0;
        });  
        $scope.currentViff = $scope.currentCases[0];
        $scope.currentViffId = $scope.currentViff.id;
      });

      $scope.approveDiff = function(){
        $scope.currentViff.misMatchPercentage = 0;
      };

      $scope.$apply();
    }


    key('/', function(){
      $scope.$apply(function () {
        $("#search_input").focus();
      });
      return false;
    });
    
    key('A, ctrl+A', function(){
      $scope.$apply(function () {
        $scope.approveDiff();
      });
      return false;
    });

    key('j', function () {
      $scope.$apply(function () {
        
        var idx = $scope.currentCases.indexOf($scope.currentViff);
        if(idx != $scope.currentCases.length - 1) {
          $scope.currentViff = $scope.currentCases[idx + 1];
          $scope.currentViffId = $scope.currentViff.id;
        }
        return false;
      });
    });

    key('k', function () {
      $scope.$apply(function () {
        var idx = $scope.currentCases.indexOf($scope.currentViff);
        if(idx !== 0) {
          $scope.currentViff = $scope.currentCases[idx - 1];
          $scope.currentViffId = $scope.currentViff.id;
        }
        return false;
      });
    });

    key('h', function () {
      $scope.$apply(function () {
        var idx = $scope.browsers.indexOf($scope.search.browser);
        if(idx !== 0) {
          $scope.search.browser = $scope.browsers[idx - 1];
        }
        return false;
      });
    });

    key('l', function () {
      $scope.$apply(function () {
        var idx = $scope.browsers.indexOf($scope.search.browser);
        if(idx != $scope.browsers.length - 1) {
          $scope.search.browser = $scope.browsers[idx + 1];
        }
        return false;
      });
    });

    key('f', function () {
      $scope.$apply(function () {
        $scope.search.browser = "firefox";
        return false;
      });
    });

    key('c', function () {
      $scope.$apply(function () {
        $scope.search.browser = "chrome";
        return false;
      });
    });

    key('i', function () {
      $scope.$apply(function () {
        $scope.search.browser = "ie";
        return false;
      });
    });

    key('o', function () {
      $scope.$apply(function () {
        $scope.search.browser = "opera";
        return false;
      });
    });

    key('s', function () {
      $scope.$apply(function () {
        $scope.search.browser = "safari";
        return false;
      });
    });

    function filter(arr, condition) {
      var results = [];
      angular.forEach(arr, function (item) {
        if(condition(item)) {
          results.push(item);
        }
      });
      return results;
    }

    dataService.request(init);
  }]);
