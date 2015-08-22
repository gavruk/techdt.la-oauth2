/**
 * Created by timfulmer on 7/5/15.
 */
var express=require('express'),
  fs=require('fs'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  Promise=require('bluebird'),
  controllersPath=require('path').join(__dirname,'../app/controllers');

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    var app=express(),
      promises=[];
    app.locals.title='OAuth2';
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({secret:'#1007',resave:true,saveUninitialized:true}));
    app.use(options.passport.initialize());
    options.server=app;
    fs.readdirSync(controllersPath)
      .forEach(function(controllerName) {
        var controller=require('../app/controllers/'+controllerName);
        promises.push(controller.initialize(options));
      });
    Promise.all(promises)
      .then(function(){
        var server=app.listen(8081,function(){
          console.log('%s listening at http://%s:%s',app.locals.title,
            server.address().address,server.address().port);
          options.expressServer=server;
          return resolve(options);
        });
      })
      .catch(function(err){
        return reject(err);
      });
  }
  return new Promise(initializePromise);
}

module.exports={
  initialize:initialize
};