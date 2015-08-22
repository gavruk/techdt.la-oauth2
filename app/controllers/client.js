/**
 * Created by timfulmer on 7/4/15.
 */
var Promise=require('bluebird'),
  collections=void 0;

function head(){
  return [
    function headHandler(req, res) {
      return res.send(200);
    }
  ];
}

function getClients(options){
  return [
    options.passport.authenticate('accessToken',{session:false}),
    function getClientsHandler(req,res,next){
      collections.client.find({where:{},sort:'createdAt ASC'})
        .then(function(clients){
          return res.send(clients);
        })
        .catch(function(err){
          console.log('Could not get clients:\n%s.',err.stack);
          return next(err);
        });
    }
  ];
}

function postClient(options){
  return [
    options.passport.authenticate('accessToken',{session:false}),
    function postClientHandler(req,res,next){
      collections.client.create(req.body)
        .then(function(client){
          return res.send(client);
        })
        .catch(function(err){
          return next(err);
        });
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
    if(options.server){
      options.server.head('/api/client',head());
      options.server.get('/api/client',getClients(options));
      options.server.post('/api/client',postClient(options));
    }
    resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};