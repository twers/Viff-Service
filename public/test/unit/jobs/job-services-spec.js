describe('Jobs Services', function () {


  describe('JobsResource', function() {
    var httpBackend,
        cruder,
        expectJob = { _id: 123, name: 'test' };

    beforeEach(module('viffservice/jobs'));

    beforeEach(inject(function($httpBackend, JobsResource) {
      httpBackend = $httpBackend;
      cruder = JobsResource;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('#all', function() {
      beforeEach(function() {
        httpBackend.when('GET', '/jobs').respond([expectJob]);
      });

      it('shold get the joblist by calling all', function() {
        var joblist = cruder.all();
        httpBackend.flush();
        joblist[0].name.should.equal(expectJob.name);
      });

      it('should send GET /jobs request to server', function() {
        httpBackend.expectGET('/jobs');
        cruder.all();
        httpBackend.flush();
      });
    });

    describe('#create', function() {

      beforeEach(function () {
        httpBackend.when('POST', '/jobs').respond(expectJob);
      });

      it('should send POST /jobs request to server', function() {
        httpBackend.expectPOST('/jobs', expectJob);
        cruder.create(expectJob);
        httpBackend.flush();
      });

      it('should get the response after posted to server', function() {
        var job = cruder.create(expectJob);
        httpBackend.flush();
        job.name.should.equal(expectJob.name);
      });
    });

    describe('#show', function() {
      beforeEach(function() {
        httpBackend.when('GET', /\/jobs\/\d+/).respond(expectJob);
      });

      it('should send GET /jobs/:id when calling show with an object which have _id prop', function() {
        httpBackend.expectGET('/jobs/123');
        cruder.show({_id: 123});
        httpBackend.flush();
      });

      it('should get the result from server', function() {
        var job = cruder.show({_id: 123});
        httpBackend.flush();
        job.name.should.equal(expectJob.name);
      });
    });

    describe('#findById', function () {
      beforeEach(function() {
        httpBackend.when('GET', /\/jobs\/\d+/).respond(expectJob);
      });

      it('should send GET /jobs/:id when calling show with an _id', function() {
        httpBackend.expectGET('/jobs/123');
        cruder.findById(123);
        httpBackend.flush();
      });

      it('should get the result from server', function() {
        var job = cruder.findById(123);
        httpBackend.flush();
        job.name.should.equal(expectJob.name);
      });
    });

    describe('#update', function () {
      beforeEach(function() {
        httpBackend.when('PUT', /\/jobs\/\d+/).respond(expectJob);
      });

      it('should send PUT /jobs/:id with an object', function() {
        httpBackend.expectPUT('/jobs/123', expectJob);
        cruder.update(expectJob);
        httpBackend.flush();
      });
      
      it('should get the updated object after request', function() {
        httpBackend.expectPUT('/jobs/123', expectJob);
        var job = cruder.update(expectJob);
        httpBackend.flush();
        job.name.should.equal(expectJob.name);
        job._id.should.equal(expectJob._id);
      }); 
    });

    describe('#remove', function () {
      beforeEach(function () {
        httpBackend.when('DELETE', '/jobs/123').respond(expectJob);
      });

      it('should send DELETE /jobs/:id request', function() {
        httpBackend.expectDELETE('/jobs/123');
        cruder.remove({_id: 123});
        httpBackend.flush();
      });
    });

    describe('#removeById', function() {
      beforeEach(function () {
        httpBackend.when('DELETE', '/jobs/123').respond(expectJob);
      });

      it('should send DELETE /jobs/:id request', function() {
        httpBackend.expectDELETE('/jobs/123');
        cruder.removeById(123);
        httpBackend.flush();
      });
    });
  });
  
  describe('JobsFactory', function () {
    
  });

});


