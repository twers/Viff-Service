var _ = require('lodash');
var Schema = require('./schema');


function ModelBuilder(schema) {

  function Model(obj) {
    this._doc = {};

    // initialize properties 
    if (obj instanceof Model) {
      obj = obj.toObject();
    }
    
    _.extend(this._doc, obj);
  }

  Model.prototype.toObject = function() {
    return _.extend({}, this.doc);
  };

  Model.prototype.set = function(key, val) {
    this._doc[key] = val;
  };

  Model.prototype.get = function(key) {
    return this.doc[key];
  };

  Model.prototype.each = function(fn) {
    return _.each(this.toObject(), fn, this);
  };

  _.extend(Model.prototype, schema.methods);

  return Model;
}

ModelBuilder.Schema = Schema;

module.exports = ModelBuilder;
