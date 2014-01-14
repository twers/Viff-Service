function Schema() {
  this.methods = {};
  this.validations = {};
}

Schema.prototype.validate = function(prop, validationFn) {
  this.validations[prop] = this.validations[prop] || [];
  this.validations[prop].push(validationFn);
};

module.exports = Schema;
