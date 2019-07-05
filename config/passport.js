var passport        = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var {Passport}      = require('./keys');
var User         = require('../models/user');


passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)))

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: Passport.clientID,
        clientSecret: Passport.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        
        // passport callback function
        var user = new User({
            username: profile.displayName,
            googleID: profile.id,
            first_name: profile.name.givenName,
            family_name: profile.name.familyName,
            profile_pic: profile._json.picture,
            native_language: profile._json.locale,
        })
    
        User.findOne({googleID: profile.id}).then(currentUser =>{
            debugger
            console.log(profile)
            console.log(profile.id)
            if(currentUser) {
                done(null, currentUser)
            }
            else {
                new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    first_name: profile.name.givenName,
                    family_name: profile.name.familyName,
                    profile_pic: profile._json.picture,
                    native_language: profile._json.locale,
                }).save().then( newUser => done(null, newUser))
            }
        })
    })
)