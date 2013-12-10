// Karma configuration
// Generated on Mon Dec 09 2013 18:13:08 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: './public',

    urlRoot: '/_karma_/',

    // frameworks to use
    frameworks: ['ng-scenario'],

    // list of files / patterns to load in the browser
    files: [
      // tests
      'bower_components/jquery/jquery.js',
      'bower_components/angular/angular.js',
      'test/e2e/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    
    plugins : [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-ng-scenario'
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    proxies: {
      '/': 'http://localhost:3000/'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
