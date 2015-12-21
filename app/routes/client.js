var clientCollection = require('../models/client.js');

var headClient = function(req, res) {
  return res.send(200);
};

var getClients = function(req, res, next) {
  clientCollection.find({where: {}, sort: 'createdAt ASC'})
  .then(function(clients) {
    return res.send(clients);
  })
  .catch(function(err) {
    console.log('Could not get clients: \n%s.', err.stack);
    return next(err);
  });
};

var postClient = function(req, res, next) {
  clientCollection.create(req.body)
  .then(function(client) {
    return res.send(client);
  })
  .catch(function(err) {
    return next(err);
  });
};

module.exports = {
  headClient: headClient,
  getClients: getClients,
  postClient: postClient
};
