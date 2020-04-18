var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//jwt 
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

//get secret key
var config = require('./config');
//here authenticatation need to be provided in body
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//support for session for passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//get jwt token
exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,   // payload, secretkey
        {expiresIn:3600});
}


var opts ={};
//how json web token will be extracted from incoming request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;// secret key to use signining

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    function(jwt_payload, done){
        console.log("JWT Payload ", jwt_payload);
        User.findOne({_id: jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user)
            {
                return done(null,user);
            }
            else {
                return done(null,false)
            }
        });
    }));
// verifyUser will use to verify registered user
//this is a middleware take req,res,next by default
exports.verifyUser = passport.authenticate('jwt',{session:false});