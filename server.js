var passport = require('passport');
var express = require('express');
var oauth2orize = require('oauth2orize');

var config = require('./config/config.js');

var app = express();
var oauthServer = oauth2orize.createServer();

require('./config/passport.js')(passport);
require('./config/express.js')(app);
require('./config/oauth2orize.js')(oauthServer);

require('./config/routes.js')(app, oauthServer);

require('./config/mongoose.js')();


var server = app.listen(config.port, function() {
  console.log('%s listening at http://%s:%s', app.locals.title, server.address().address, server.address().port);
});
