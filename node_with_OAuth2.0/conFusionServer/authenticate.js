const passport = require('passport');
const  LocalStrategy =require('passport-local').Strategy;
const users = require('./model/users');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const config = require('./config.js');

var FacebookTokenStrategy = require('passport-facebook-token');

//creating local strategy
exports.local = passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

//function getToken to get the jwt token
exports.getToken = function (users){
    return jwt.sign(users,config.secretKey, {expiresIn:3600});
};

var opts ={};
opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  config.secretKey;

//creating jwt strategy
    exports.jwtPassport = passport.use(new JwtStrategy(opts,
        (jwt_payload, done) => {
            console.log("JWT payload: ", jwt_payload);
            users.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                else if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        }));

////verifyUser Function to verify registered user only
exports.verifyUser = passport.authenticate('jwt',{session: false});

//verifyAdmin Function to verify Admin user only
  exports.verifyAdmin =(req,res,next)=> {
    if(req.user.admin != true) {
        var err = new Error("You are not authorized to perform this operation!");        
        err.statusCode = 403;
        return next(err); 
    }
        else{
            next();
      }
}

//oauth strategy
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));