'use strict';

module.exports = environment;

function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function environment (envToken) {
  var env = {},
      defaultEnvironments = ['development', 'test', 'production'],
      envToken = !!envToken ? envToken.toLowerCase() : 'development';

  if(!defaultEnvironments.indexOf(envToken)) {
    envToken = 'development';
  }

  defaultEnvironments.forEach(function (name) {
    env['is' + capitalize(name)] = name == envToken;
  });

  return env;
}