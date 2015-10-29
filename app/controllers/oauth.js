/**
 * Created by timfulmer on 7/4/15.
 */
var Promise=require('bluebird'),
  _=require('lodash'),
  collections=void 0,
  oauth2Server=void 0,
  passport=void 0;

function authenticate(){
  return [
    passport.authenticate('userBasic',{session:false}),
    function(req,res,done){
      req.query=_.assign(req.query,req.body);
      done();
    },
    oauth2Server.authorization(function(clientId, redirectURI, done) {
      collections.client.findOne({clientId: clientId})
        .then(function(client) {
          var found=false;
          client.redirectURI.some(function(uri){
            if(uri===redirectURI){
              found=true;
              return true;
            }
            return false;
          });
          if(found){
            return done(null, client, redirectURI);
          }
          return done(new Error('Client redirect URI does not match the requested redirect URI.'));
        })
        .catch(function(err){
          return done(err);
        });
    }),
    // automatically approve the access
    function(req,res,done){
      req.body.transaction_id=req.oauth2.transactionID;
      done();
    },
    oauth2Server.decision()
  ];
}
function authorize(){
  return[
    passport.authenticate('accessToken',{session:false}),
    function(req,res,done){
      res.json({authorized:true,user:req.user,info:req.authInfo});
      return done();
    }
  ];
}

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    if(!options.collections || !options.collections.client){
      return reject(new Error('Could not find Client ORM from config.'));
    }
    collections=options.collections;
    if(!options.oauth2Server){
      return reject(new Error('Could not find oauth2orize from config.'));
    }
    oauth2Server=options.oauth2Server;
    if(!options.passport){
      return reject(new Error('Could not find passport from config.'));
    }
    passport=options.passport;
    if(options.server){
      options.server.post('/api/authenticate',authenticate());
      options.server.get('/api/authorize',authorize());
    }
    resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};