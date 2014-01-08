'use strict';

module.exports = {
  seleniumHost: 'http://localhost:4444/wd/hub',
  browsers: ['phantomjs'/*, 'chrome', 'safari', 'opera'*/],
  envHosts: {
    build: 'http://baidu.com',
    prod: 'http://www.google.com'
  },
  paths: [
    '/'
  ], 
  reportFormat: 'file' /* 'html' or 'json' */
};
