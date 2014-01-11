'use strict';

describe('jobs navigation', function () {
  
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('could navigate to a specific job item when I click it', function () {
    element('.job-list li:first-child a').click();
    expect(element('.job-header h1').text()).toEqual('demo job');
    expect(element('.job-header .description').text()).toEqual('this is a demo job');
  });

});