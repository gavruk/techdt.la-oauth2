var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');

module.exports = function(app) {
    app.locals.title = 'OAuth2';
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({secret: '#1007', resave: true, saveUninitialized: true}));
    app.use(passport.initialize());
};
