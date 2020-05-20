const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require ('passport-jwt').ExtractJwt;
const User = require('../model/user');

var opt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'
}

passport.use(new JWTStrategy(opt, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){console,log('error in finding user from jwt');return;}
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
           
    })
}));

module.exports = passport;