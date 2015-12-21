var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  token: {type: String},
  exporationDate: {type: Date},
  userId: {type: String},
  clientId: {type: String},
}, { collection: 'accesstoken' });

module.exports = mongoose.model('accessToken', schema);
