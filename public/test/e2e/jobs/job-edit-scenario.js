'use strict';

describe('job edit', function () {
  
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should show clicked job detail in input field', function () {
    element('.job-list li:nth-child(2) a').click();
    element('.job-content .edit').click();
    expect(element('.edit-job input[name="name"]').val()).toEqual('demo job');
    expect(element('.edit-job textarea[name="description"]').val()).toEqual('this is a demo job');
  });


  it('should get the new job detail after updating', function() {
    var newJobName = "demo job for edit update";
    var newJobDescription = "this is another demo job updated";
    
    element('.job-list li:first-child a').click();
    element('.job-content .edit').click();

    element('input[name="name"]').val(newJobName);
    element('.edit-job textarea[name="description"]').val(newJobDescription);
    element('.edit-job input[type="submit"]').click();

    sleep(0.5);
    expect(element('.job-header h1').text()).toEqual(newJobName);
    expect(element('.job-header .description').text()).toEqual(newJobDescription);
  });
});
