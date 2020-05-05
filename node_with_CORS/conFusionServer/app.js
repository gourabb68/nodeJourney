var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config.js');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//import our own routing file
var dishesRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
const Dishes = require('./model/dishes');
const url = config.mongoUrl;
// 'mongodb://localhost:27017/conFusion';
var passport = require('passport');
var authenticate = require('./authenticate');


const connect = mongoose.connect(url);
  connect.then((db)=>{
    console.log('Connected corrrectly to Server');
  }).catch((err)=>{ console.log(err);});

var app = express();
// Secure traffic only
// app.all('*', (req, res, next) => {
//   if (req.secure) {
//     return next();
//   }
//   else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12354-13549-46448-31356'));
//adding auth middleware
// function auth(req,res,next){
//   console.log(req.headers);
//   const authHeaders = req.headers.authorization;
//   if(authHeaders == null){
//     var err = new Error('you are not authorized');
//     res.setHeader('WWW-Authenticate','Basic');
//     err.statusCode =401;
//     next(err);
//     return;
//   }
//   else {
//     var auth = new Buffer(authHeaders.split(' ')[1],'base64').toString().split(':');
//     var user = auth[0];
//     var password = auth[1];
//     if(user ==='admin' && password === 'password'){
//         next();
//     }
//     else{
//       var err = new Error('you are not authorized');
//     res.setHeader('WWW-Authenticate','Basic');
//     err.statusCode =401;
//     next(err);
//     return;
//     }
  
//   }

// }



// app.use(cookieParser('12345-67890-09876-54321'));
// app.use(session({
//   name: 'session-id',
//   secret: '12336-54544-55654-65122',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }))
app.use(passport.initialize())
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth (req, res, next) {
//   // console.log(req.session);

// if(!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     return next(err);
// }
// else {
//   next();
// }
// }
// app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//adding the route
app.use('/dishes', dishesRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
