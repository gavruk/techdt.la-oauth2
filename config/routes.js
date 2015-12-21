var passport = require('passport');
var _ = require('lodash');

var clientRoutes = require('../app/routes/client.js');
var userRoutes = require('../app/routes/user.js');
var oauthRoutes = require('../app/routes/oauth.js');

var mergeQueryBody = function(req, res, next) {
  req.query = _.assign(req.query, req.body);
  next();
};

var giveAccess = function(req, res, next) {
  req.body.transaction_id = req.oauth2.transactionID;
  next();
};

module.exports = function(app, oauth2Server) {
  app.head('/api/client', clientRoutes.headClient);
  app.get('/api/client', passport.authenticate('accessToken', {session: false}), clientRoutes.getClients);
  app.post('/api/client', passport.authenticate('accessToken', {session: false}), clientRoutes.postClient);

  app.post('/api/authenticate',
           passport.authenticate('userBasic', {session: false}),
           mergeQueryBody,
           oauthRoutes.authenticate(oauth2Server),
           giveAccess,
           oauth2Server.decision());
  app.get('/api/authorize', passport.authenticate('accessToken', {session: false}), oauthRoutes.authorize);

  app.head('/api/user', passport.authenticate('accessToken', {session: false}), userRoutes.headUser);
  app.get('/api/user', passport.authenticate('accessToken', {session: false}), userRoutes.getUsers);
  app.post('/api/user', passport.authenticate('clientBasic', {session: false}), userRoutes.postUser);
};
