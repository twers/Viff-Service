module.exports = [
  '$resource',
  function(resource) {

    var buildResource = resource('/jobs/:jid/builds/:_id', null, {
      create: { method: 'POST' },
      all: { method: 'GET', isArray: true }
    });

    return buildResource;
  }
];