var passport        = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var {Passport}      = require('./keys');
var Founder         = require('../models/founder');


passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => Founder.findById(id).then(founder => done(null, founder)))

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: Passport.clientID,
        clientSecret: Passport.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        Founder.findOne({googleID: profile.id}).then(currentFounder =>{
            if(currentFounder) {
                done(null, currentFounder)
            }
            else {
                new Founder({
                    username: profile.displayName,
                    googleID: profile.id,
                    first_name: profile.name.givenName,
                    family_name: profile.name.familyName,
                    profile_pic: profile._json.picture,
                }).save().then( newFounder => done(null, newFounder))
            }
        })
    })
);