var mongoskin = require('mongoskin');

var db = mongoskin.db('mongodb://localhost:27017/viffService?auto_reconnect', {safe:true});

module.exports = function(collectionName, bindings) {
  db[collectionName] = db[collectionName] || db.collection(collectionName);
  if (bindings) {
    db.bind(collectionName, bindings);
  }
  return db[collectionName];
};
