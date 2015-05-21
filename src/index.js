var async = require('async');

// requires mongoose to be connected to the database
module.exports = function erase(mongoose, done) {
  async.waterfall([
    // ensure a database connection is established
    function(cb) {
      if (!mongoose.connection.db) {
        return cb(new Error('no established database connection'));
      }
      cb();
    },
    // get collections
    function(cb) {
      mongoose.connection.db.collections(cb);
    },
    // drop collections
    function(collections, cb) {
      async.each(collections, function(collection, eachCb) {
        if (collection.collectionName.match(/^system\./)) {return eachCb();}
        // drop collection
        collection.drop(eachCb);
      }, cb);
    },
    // reset mongoose models
    function(cb) {
      mongoose.connection.models = {};
      mongoose.models = {};
      mongoose.modelSchemas = {};
      cb();
    },
    //// ensureIndexes
    //_.map(models, function (model) {
    //  return model.ensureIndexes.bind(model);
    //})
  ], done);
};
