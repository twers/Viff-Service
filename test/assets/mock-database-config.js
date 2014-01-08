'use strict';

module.exports = {
  development: {
    connection: 'development-db-connection'
  },
  test: {
    connection: 'test-db-connection',
    anotherProperty: 'another-property'
  },
  production: {
    connection: 'production-db-connection'
  }
};