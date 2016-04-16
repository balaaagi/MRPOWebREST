var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo=require('mongoskin')
var mongodb=require('mongodb')

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var db=mongo.db("mongodb://localhost:27017/MRPO",{native_parser:true})
var medicine_id,patient_id;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}





// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;


routes.get('/medicines',function(req,res){
  db.collection('medicines').find().toArray(function(err,docs){
    if(err){
      res.send("There is error");
    }else{
      res.send(docs);
    }

  });
  
})

routes.get('/medicine_details/:medicine_id',function(req,res){
  medicine_id=new mongodb.ObjectID(req.params.medicine_id.valueOf());
  console.log(medicine_id);
  db.collection('medicines').find({'_id':medicine_id}).toArray(function(err,docs){
    if(err){
      res.send("There is error");
    }else{
      res.send(docs);
    }
  })
});

routes.post('/addPrescription/:patient_id,:medicine_id',function(req,res){
  medicine_id=new mongodb.ObjectID(req.params.medicine_id.valueOf());
  patient_id=req.params.patient_id.valueOf();
  db.collection('prescriptions').insert({'patient_id':patient_id,'medicine_id':medicine_id},function(err,docs){
    if(err){
      res.send("Failure");
    }else{
      res.send("Success");
    }
  })
})




