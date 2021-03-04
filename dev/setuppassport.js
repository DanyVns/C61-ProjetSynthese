var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(courriel, password, done) {
    User.findOne({ courriel: courriel }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "Aucun usager avec ce courriel" });
      }
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Mot de passe invalide." });
        }
      });
    });
  }));

};