'use strict';

describe('job edit', function () {
  
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should show clicked job detail in input field', function () {
    element('.job-list li:first-child a').click();
    element('.job-content .edit').click();
    expect(element('.edit-job input[name="name"]').val()).toEqual('demo job');
    expect(element('.edit-job textarea[name="description"]').val()).toEqual('this is a demo job');
  });
});
