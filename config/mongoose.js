var mongoose = require('mongoose');

var config = require('./config.js');

module.exports = function() {
  mongoose.Promise = require('bluebird');
  mongoose.connect(config.db);
  mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
  });

  if (config.debug) {
    mongoose.set('debug', true);
  }
};
