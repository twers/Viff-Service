'use strict';

describe('builds list', function () {

  beforeEach(function () {
    browser().navigateTo('/');
    element('.job-list li:first-child a').click();
  });

  it('should list builds list for given job', function () {
    expect(element('.job-history li').count()).toEqual(2);
    expect(element('.job-history li:first .number').text()).toEqual('#1');
  });

});