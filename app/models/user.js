var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  createdAt: {type: Date},
  updatedAt: {type: Date},
}, { collection: 'user' });

module.exports = mongoose.model('user', schema);
