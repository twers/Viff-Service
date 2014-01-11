'use strict';

module.exports = {
  development: {
    connection: 'mongodb://localhost:27017/viffService-development?auto_reconnect'
  },
  test: {
    connection: 'mongodb://localhost:27017/viffService-test?auto_reconnect'
  },
  production: {
    connection: 'mongodb://localhost:27017/viffService-production?auto_reconnect'
  }
};