'use strict';

var environment = require('../../config/environment');

describe('environment', function () {

  describe('is#', function () {
    
    it('should be dev environment if I pass nothing', function () {
      environment().isDevelopment.should.be.true;
    });

    it('should be development environment if I pass "development"', function () {
      environment('development').isDevelopment.should.be.true;
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

});