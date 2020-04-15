var createError = require('http-errors');
var express = require('express');
var path = require('path');
//require to set up cookie 
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//import our own routing file
var dishesRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookie parser already been included as middle ware
// provide a secret key(any string) so as to make a sign cookie
app.use(cookieParser('12345-65412-31354-54546'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//above  '/' and '/users' are before auth middleware so no authentication required
// function for authentication 
function auth (req, res, next) {
  console.log(req.signedCookies);

  if(!req.signedCookies.user){//user is a poperty that will set up in sign cookie
    //user not been authorized yet here we are expecting user to authorize urself
    var authHeader = req.headers.authorization;//here we have username and passwrd converted to base64
    // as  Basic QjjbkWIKCSKadkhlklb==
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
  /// taking QjjbkWIKCSKadkhlklb== using split thn decode and split and got username and password
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
       //setup the cookie here and adding user property
        res.cookie('user','admin',{signed:true})
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        next(err);
    }
  }
  else{
       if (req.signedCookies.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
  
}
// creating middleware for basic authentication
app.use(auth);

//adding the route
app.use('/dishes', dishesRouter);
app.use('/promo', promoRouter);
app.use('/leader', leaderRouter);

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
