var User = require('../models/user.js');

var headUser = function(req, res) {
  return res.send(200);
};

var getUsers = function(req, res, next) {
  User.find({})
    .sort({createdAt: 1})
    .then(function(users) {
      return res.send(users);
    })
    .catch(function(err) {
      console.log('Could not get users: \n%s.', err.stack);
      return next(err);
    });
};

var postUser = function(req, res, next) {
  var user = new User(req.body);
  user.save()
    .then(function(user) {
      return res.send(user);
    })
    .catch(function(err) {
      return next(err);
    });
};


module.exports = {
  headUser: headUser,
  getUsers: getUsers,
  postUser: postUser
};
