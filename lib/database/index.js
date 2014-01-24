var mongoskin = require('mongoskin');
var environment = require('../../config/environment');

var db = mongoskin.db(environment().db.connection, {safe:false});

module.exports = function (collectionName, bindings) {
  db[collectionName] = db[collectionName] || db.collection(collectionName);
  if (bindings) {
    db.bind(collectionName, bindings);
  }
  return db[collectionName];
};


module.exports.db = db;
