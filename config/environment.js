'use strict';

module.exports = environment;

function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function environment (envToken) {
  var env = {},
      defaultEnvironments = ['development', 'test', 'production'],
      dbconfig = require(environment.dbConfigPath) || {};
  envToken = !!envToken ? envToken : (process.env.NODE_ENV || 'development');
  envToken = envToken.toLowerCase();
  envToken = defaultEnvironments.indexOf(envToken) !== -1 ? envToken : 'development';

  defaultEnvironments.forEach(function (name) {
    env['is' + capitalize(name)] = name == envToken;
  });

  env['db'] = dbconfig[envToken];

  return env;
}

environment.dbConfigPath = './database-config.js'