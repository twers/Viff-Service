module.exports = {
  create: function (job, opts, fn) {
    return this.save(job, opts, fn);
  },
  all: function (fn) {
    return this.find().toArray(fn);
  }
};
