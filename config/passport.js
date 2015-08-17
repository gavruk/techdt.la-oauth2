/**
 * Created by timfulmer on 7/26/15.
 */
var passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  Promise=require('bluebird');

function initialize(options){
  options=options || {};
  function initializePromise(resolve){
    passport.serializeUser(function(user,done) {
      return done(null,user.username);
    });
    passport.deserializeUser(function(id,done) {
      options.collections.user.findOne({username: id})
        .then(function (user){
          return done(null, user);
        })
        .catch(function(err){
          return done(err);
        });
    });
    passport.use("clientBasic",new BasicStrategy(
      function (clientId,clientSecret,done) {
        options.collections.client.findOne({clientId:clientId})
          .then(function(client){
            if(!client) return done(null, false);
            return done(null, client);
          })
          .catch(function(err){
            return done(err);
          });
      }
    ));
    passport.use("userBasic",new BasicStrategy(
      function (username,password,done) {
        options.collections.user.findOne({username:username})
          .then(function(user) {
            if(!user) return done(null, false);
            if(user.password!==password){
              return done(null,false);
            }
            return done(null,user);
          })
          .catch(function(err){
            return done(err);
          });
      }
    ));
    passport.use("accessToken", new BearerStrategy(
      function (accessToken, done) {
        options.collections.accesstoken.findOne({token: accessToken})
          .then(function(token) {
            if(!token) return done(null, false);
            if(new Date() > token.expirationDate) {
              options.collections.accesstoken.destroy({token: accessToken})
                .then(function(){
                  return done(null)
                })
                .catch(function(err){
                  return done(err);
                });
            } else {
              var findUserPromise=options.collections.user.findOne({username:token.userId})
                .then(function(user){
                  return {user:user};
                });
              var findClientPromise=options.collections.client.findOne({clientId:token.clientId})
                .then(function(client){
                  return {client:client};
                });
              Promise
                .reduce([findUserPromise,findClientPromise],function(results,result){
                  if(result.user){
                    results.user=result.user;
                  }
                  if(result.client){
                    results.client=result.client;
                  }
                  return results;
                },{})
                .then(function(results){
                  if (!results.user || !results.client) return done(null, false);
                  // Put client redirect URI in scope for authorization later,
                  //   located in `req.authInfo`.
                  var info={scope:results.client.redirectURI};
                  return done(null,results.user,info);
                })
                .catch(function(err){
                  return done(err);
                });
            }
          })
          .catch(function(err){
            return done(err);
          });
      }
    ));
    options.passport=passport;
    return resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};
