
describe('Home Functional Tests', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should get the location /', function() {
    expect(browser().location().path()).toBe("/");
  });

});
