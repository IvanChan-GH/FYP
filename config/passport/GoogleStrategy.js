'use strict';

var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth2').Strategy;

//var verifyHandler = function(req, token, tokenSecret, profile, done) {
var verifyHandler = function (accessToken, refreshToken, profile, cb, done) {
  // console.log('CB:'+JSON.stringify(cb));
  var data = {
    id: cb.id,
    name: cb.displayName,
    email: cb.emails[0].value,
    emailVerified: cb.emails[0].verified,
    picture: cb.picture
  };

  return done(null, data);
};

passport.use(new GoogleStrategy({
  clientID: '162572227800-k5ps6j4362pel3o3a16t40eremj6j0th.apps.googleusercontent.com',
  clientSecret: 'NzjUAweZV4kZxkSWUUHpwDjU',
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, verifyHandler));