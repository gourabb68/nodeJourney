var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
//here authenticatation need to be provided in body
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//support for session for passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


