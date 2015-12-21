var oauth2orize = require('oauth2orize');
var utils = require('../app/utils');

var Client = require('../app/models/client.js');
var AccessToken = require('../app/models/accessToken.js');

module.exports = function(server) {
  server.serializeClient(function(client, done) {
    return done(null, client.clientId);
  });
  server.deserializeClient(function(id, done) {
    Client.findOne({clientId: id})
    .then(function(client) {
      return done(null, client);
    })
    .catch(function(err) {
      return done(err);
    });
  });

  //Implicit grant
  var token = oauth2orize.grant.token(function (client, user, ares, done) {
    var token = utils.uid(256);
    var expirationDate = new Date(new Date().getTime() + (3600 * 1000));
    AccessToken.create({
      token: token,
      expirationDate: expirationDate,
      userId: user.username,
      clientId: client.clientId
    })
    .then(function(accessToken) {
      return done(null, token, {expires_in: expirationDate.toISOString()});
    })
    .catch(function(err) {
      return done(err);
    });
  });
  var response = token.response;
  token.response = function(txn, res, next) {
    var fakeRes = {
      redirect: function(url) {
        if(url.indexOf('access_token') > -1) {
          var start = url.indexOf('access_token') + 13,
            end = url.indexOf('&');
            res.json({accessToken: url.substring(start, end)});
        }else{
          res.send(401, 'Unauthorized');
        }
      }
    };
    response(txn, fakeRes, next);
  };
  server.grant(token);
};
