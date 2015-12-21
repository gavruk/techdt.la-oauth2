var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
}, { collection: 'user' });

module.exports = mongoose.model('user', schema);
