/**
 * Created by timfulmer on 7/4/15.
 */
var Promise=require('bluebird'),
  collections=void 0;

function head(req,res){
  return res.send(200);
}

function getUsers(req,res,next){
  collections.user
    .find({where:{},sort:'createdAt ASC'})
    .then(function(users){
      return res.send(users);
    })
    .catch(function(err){
      console.log('Could not get users:\n%s.',err.stack);
      return next(err);
    });
}

function postUser(req,res,next){
  collections.user.create(req.body)
    .then(function(user){
      return res.send(user);
    })
    .catch(function(err){
      return next(err);
    });
}

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    if(!options.collections || !options.collections.user){
      return reject(new Error('Could not find User ORM from config.'));
    }
    collections=options.collections;
    if(options.server){
      options.server.head('/api/user',options.passport.authenticate('accessToken',{session:false}),head);
      options.server.get('/api/user',options.passport.authenticate('accessToken',{session:false}),getUsers);
      options.server.post('/api/user',options.passport.authenticate('clientBasic',{session:false}),postUser);
    }
    resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};