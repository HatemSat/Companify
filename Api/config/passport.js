const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const member = require('../models/member.model');
const admin = require('../models/admin.model');

passport.use('member',new localStrategy({
    usernameField: 'email'
  },
  (username, password, done) => {
    member.findOne({ email: username }, (err, member) => {
      if (err) { return done(err); }
      if (!member) {
        return done(null, false, {
          message: 'Incorrect email.'
        });
      }
      if (!member.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, member);
    });
  }
));


passport.use('admin',new localStrategy({
    usernameField: 'email'
  },
  (username, password, done) => {
    admin.findOne({ email: username }, (err, admin) => {
      if (err) { return done(err); }
      if (!admin) {
        return done(null, false, {
          message: 'Incorrect email.'
        });
      }
      if (!admin.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, admin);
    });
  }
));

