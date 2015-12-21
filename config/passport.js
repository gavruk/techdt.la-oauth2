var Promise = require('bluebird');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../app/models/user.js');
var Client = require('../app/models/client.js');
var AccessToken = require('../app/models/accessToken.js');

module.exports = function() {

  passport.serializeUser(function(user, done) {
    return done(null, user.username);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({username: id})
    .then(function (user) {
      return done(null, user);
    })
    .catch(function(err) {
      return done(err);
    });
  });

  passport.use("clientBasic", new BasicStrategy(
    function (clientId, clientSecret, done) {
      Client.findOne({clientId: clientId})
      .then(function(client) {
        if(!client) return done(null, false);
        return done(null, client);
      })
      .catch(function(err) {
        return done(err);
      });
    }
  ));

  passport.use("userBasic", new BasicStrategy(
    function (username, password, done) {
      User.findOne({username: username})
      .then(function(user) {
        if(!user) return done(null, false);
        if(user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(function(err) {
        return done(err);
      });
    }
  ));

  passport.use("accessToken", new BearerStrategy(
    function (accessToken, done) {
      AccessToken.findOne({token: accessToken})
      .then(function(token) {
        if(!token) return done(null, false);
        if(new Date() > token.expirationDate) {
          AccessToken.remove({token: accessToken})
          .then(function() {
            return done(null);
          })
          .catch(function(err) {
            return done(err);
          });
        } else {
          var findUserPromise = User.findOne({username: token.userId})
          .then(function(user) {
            return {user: user};
          });
          var findClientPromise = Client.findOne({clientId: token.clientId})
          .then(function(client) {
            return {client: client};
          });
          Promise
          .reduce([findUserPromise, findClientPromise], function(results, result) {
            if(result.user) {
              results.user = result.user;
            }
            if(result.client) {
              results.client = result.client;
            }
            return results;
          }, {})
          .then(function(results) {
            if (!results.user || !results.client) return done(null, false);
            // Put client redirect URI in scope for authorization later,
            //   located in `req.authInfo`.
            var info = {scope: results.client.redirectURI};
            return done(null, results.user, info);
          })
          .catch(function(err) {
            return done(err);
          });
        }
      })
      .catch(function(err) {
        return done(err);
      });
    }
  ));

};
