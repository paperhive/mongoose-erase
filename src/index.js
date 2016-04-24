import { promisify } from 'bluebird';
import co from 'co';

// requires mongoose to be connected to the database
export const erase = co.wrap(function* erase(mongoose) {
  // ensure a database connection is established
  if (!mongoose.connection.db) {
    throw new Error('no established database connection');
  }

  // get collections
  const collections = yield promisify(
    mongoose.connection.db.collections,
    {context: mongoose.connection.db}
  );

  // drop collections
  yield collections.map(co.wrap((collection) => {
    // Older MongoDB installations featur system.* collections; leave those
    // untouched.
    if (!collection.collectionName.match(/^system\./)) {
      // drop collection
      collection.drop();
    }
  }));

  // reset mongoose models
  mongoose.connection.models = {};
  mongoose.models = {};
  mongoose.modelSchemas = {};
});

export const connect = co.wrap(function* connect(mongoose, dbURI, options) {
  if (mongoose.connection.db) return;
  const newOptions = options || {};
  yield promisify(mongoose.connect, {context: mongoose})(dbURI, newOptions);
});

export const connectAndErase = co.wrap(function* connectAndErase(mongoose, dbURI, options) {
  const newOptions = options || {};
  yield connect(mongoose, dbURI, newOptions);
  yield erase(mongoose);
});
