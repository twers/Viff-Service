function Cruder(jobId) {
  this._jobId = jobId;
}

Cruder.prototype.bind = function () {
  var _jobId = this._jobId;
  return{
    builds: function (fn) {
      this.find({_id: _jobId}).toArray(function (err, data) {
        //mongo return Data structure here is like:
//      [
//        { _id: 52c94d7cc57e74dd01000001,
//          build: [ [Object], [Object] ],
//          config: '/fake.js',
//          name: 'job without build' }
//      ]
        //need to transform it.
        var transformedData = data[0].build;
        fn(err, transformedData);
      });
    },
    addBuild: function (build, fn) {
      this.update({_id: _jobId}, { $push: {build: build}}, fn);
    },
    getLastBuild: function (fn) {
      this.find({_id: _jobId}).toArray(function (err, data) {
        var transformedData = data[0].build.slice(-1)[0];
        fn(err, transformedData);
      });
    }
  };
};

module.exports = function (jobId) {
  return new Cruder(jobId);
};