var crypto = require('crypto');

exports.uid = function (len) {
  return crypto.randomBytes(len).toString('hex');
};
