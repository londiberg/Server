// console.developers.google.com
const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user,done) => {
  done(null,user.id)
});

passport.deserializeUser((id,done) => {
User.findById(id)
.then(user => {
  done(null, user);
})
});
passport.use(
  new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("access token", accessToken);
      // console.log("refreshToken", refreshToken);
      console.log("profile:", profile);
      User.findOne({
        googleId: profile.id
      }).then(existingUser => {
        if (existingUser) {
          // already there
          console.log("profile there: ", profile.id);
          done(null, existingUser);
        } else {
          // no user
          console.log("profile not there: ", profile.id);
          new User({
              googleId: profile.id
            })
            .save()
            .then(user => done(null, User));
        }
      });
    }
  )
);