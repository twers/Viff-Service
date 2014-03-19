angular.module('viffReport')
  .factory('dataService', function () {

    function constructViffCase (browser, url, oneCase) {
      var viffCase = angular.copy(oneCase);
      viffCase.browser = browser;
      viffCase.url = url;
      viffCase.diffPath = viffCase.images.diff.replace(/%/gi,"%25");
      viffCase.id = 'viff' + parseInt(Math.random() * new Date().getTime());

      viffCase.envs = [];
      angular.forEach(viffCase.images, function (path, envName) {
        if(envName != 'diff') {
          viffCase.envs.push({
            name: envName,
            path: path.replace(/%/gi,"%25")
          });
        }
      });
      return viffCase;
    }

    return {
      request : function (callback) {
        $.getJSON('report.json').success(function (results) {
          var compares = results.compares;
          var ret = [];
          var browsers = [];

          angular.forEach(compares, function (viffCases, browser) {
            browsers.push(browser);
            angular.forEach(viffCases, function (viffCase, url) {
              ret.push(constructViffCase(browser, url, viffCase));
            });
          });

          callback && callback(ret, results.diffCount, results.caseCount, results.totalAnalysisTime, browsers);
        });  
      }
    };
  });
