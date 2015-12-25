const async = require('async');

// requires mongoose to be connected to the database
function erase(mongoose, done) {
  async.waterfall([
    // ensure a database connection is established
    (cb) => {
      if (!mongoose.connection.db) {
        return cb(new Error('no established database connection'));
      }
      cb();
    },
    // get collections
    (cb) => {
      mongoose.connection.db.collections(cb);
    },
    // drop collections
    (collections, cb) => {
      async.each(collections, (collection, eachCb) => {
        if (collection.collectionName.match(/^system\./)) {return eachCb();}
        // drop collection
        collection.drop(eachCb);
      }, cb);
    },
    // reset mongoose models
    (cb) => {
      mongoose.connection.models = {};
      mongoose.models = {};
      mongoose.modelSchemas = {};
      cb();
    },
    // // ensureIndexes
    // _.map(models, function (model) {
    //   return model.ensureIndexes.bind(model);
    // })
  ], done);
}

function connect(mongoose, dbURI, options, cb) {
  if (mongoose.connection.db) {return cb();}
  mongoose.connect(dbURI, options, cb);
}

function connectAndErase(mongoose, dbURI, options) {
  const newOptions = options || {};
  return (done) => {
    async.series([
      (cb) => {
        connect(mongoose, dbURI, newOptions, cb);
      },
      (cb) => {
        erase(mongoose, cb);
      },
    ], done);
  };
}

module.exports = {
  connect: connect,
  erase: erase,
  connectAndErase: connectAndErase,
};
