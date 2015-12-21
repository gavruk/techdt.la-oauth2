var Client = require('../models/client.js');

var authenticate = function(oauth2Server) {
  return oauth2Server.authorization(function(clientId, redirectURI, done) {
    Client.findOne({clientId: clientId})
    .then(function(client) {
      var found = false;
      client.redirectURI.some(function(uri) {
        if(uri === redirectURI) {
          found = true;
          return true;
        }
        return false;
      });
      if(found) {
        return done(null, client, redirectURI);
      }
      return done(new Error('Client redirect URI does not match the requested redirect URI.'));
    })
    .catch(function(err) {
      return done(err);
    });
  });
};

var authorize = function(req, res, next) {
  res.json({authorized: true, user: req.user, info: req.authInfo});
  return next();
};

module.exports = {
  authenticate: authenticate,
  authorize: authorize,
};
