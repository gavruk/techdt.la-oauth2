var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {type: String},
  clientId: {type: String},
  clientSecret: {type: String},
  redirectURI: {type: Array}
}, { collection: 'client' });

module.exports = mongoose.model('client', schema);
