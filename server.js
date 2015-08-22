/**
 * Created by timfulmer on 7/4/15.
 */
var waterline=require('./config/waterline'),
  oauth2orize=require('./config/oauth2orize'),
  passport=require('./config/passport'),
  express=require('./config/express');

waterline.initialize()
  .then(oauth2orize.initialize)
  .then(passport.initialize)
  .then(express.initialize)
  .catch(function(err){
    console.log('Caught error running server:\n%s.',err.stack);
    process.exit(-1);
  });
