'use strict';

var sinon = require('sinon');
var path = require('path');

describe('environment', function () {

  var environment, spyRequire;

  beforeEach(cleanCacheFn('environment.js', 'database-config.js'));

  beforeEach(function () {
    spyRequire = sinon.spy(require.extensions, '.js');
    environment = require('../../config/environment');
  });

  afterEach(function () {
    spyRequire.restore();
  });

  describe('is#', function () {
    
    it('should be dev environment if I pass nothing', function () {
      environment().isDevelopment.should.be.true;
    });

    it('should be development environment if I pass "development"', function () {
      environment('development').isDevelopment.should.be.true;
    });

    it('should be not case-insensitive', function () {
      environment('pRodUCtion').isProduction.should.be.true;
    });

    it('should be development if I pass "dev"', function () {
      environment('dev').isDevelopment.should.be.true;
    });

    it('should not be test or production environment if environment is development', function () {
      environment().isTest.should.be.false;
      environment().isProduction.should.be.false;
    });

    it('should be test environment if I pass "test"', function () {
      environment('test').isTest.should.be.true;
    });

    it('should be production environment if I pass "production"', function () {
      environment('production').isProduction.should.be.true;
    });

  });

  describe('process env', function () {
    
    afterEach(function () {
      delete process.env.NODE_ENV;
    });

    it('should be development environment if NODE_ENV is set to undefined', function () {
      environment().isDevelopment.should.be.true;
    });

    it('should be production environment if NODE_ENV is set to production', function () {
      process.env.NODE_ENV = 'production';
      environment().isProduction.should.be.true;
    });

  });

  describe('db configuration', function () {

    it('should have default db config path', function () {
      environment.dbConfigPath.should.equal('./database-config.js');
    });

    it('should read database-config.js database configuration file', function () {
      environment();
      spyRequire.lastCall.args[1].should.include('database-config.js');
    });

    describe('mock db configuration', function () {

      beforeEach(function () {
        environment.dbConfigPath = path.join(__dirname, '../assets/mock-database-config.js');
      });

      it('should get db config from mock', function () {
        environment();
        spyRequire.lastCall.args[1].should.include('mock-database-config.js');
      });

      it('should get development db configuration', function () {
        environment().db.connection.should.equal('development-db-connection');
      });

      it('should get test db configuration', function () {
        environment('test').db.connection.should.equal('test-db-connection');
        environment('test').db.anotherProperty.should.equal('another-property');
      });
      
    });

  });

  function cleanCacheFn() {
    var cachesToClean = [].slice.call(arguments);
    return function () {
      for(var cachePath in require.cache) {
        if (require.cache.hasOwnProperty(cachePath)) {
          for (var i = cachesToClean.length - 1; i >= 0; i--) {
            var cacheName = cachesToClean[i];
            if(cachePath.indexOf(cacheName) >= 0) {
              delete require.cache[cachePath];
            }
          }
        }
      }
    };
  }
});
