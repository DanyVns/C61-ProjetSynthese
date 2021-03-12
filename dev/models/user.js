var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

mongoose.models = {};
mongoose.modelSchemas = {};

var SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  firstname: String,
  lastname: String
});


// Référence pour méthode d'authentification avec passport et de hashing de password : 
// 2016 'Express in Action' Evan M. Hahn. Chapitre 8  

var noop = function() {};

UserSchema.pre("save", function(done) {
  var user = this;

  if (!user.isModified("password")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

UserSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};



var User = mongoose.model("User", UserSchema);

module.exports = User;