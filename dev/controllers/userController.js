var express = require("express");
var User = require('../models/user');
var passport = require("passport");




exports.user_create_post = 
    
    
    (req, res, next) => {

    var firstname = req.body.firstName;
    var lastname = req.body.lastName;
    var password = req.body.password;
    var email = req.body.username;  




  
    User.findOne({ email: email }, function(err, user) {
  
      if (err) { return next(err); }
      if (user) {
        req.flash("error", "Utilisateur existe déjà");
        return res.redirect("/signup");
      }
  
      var newUser = new User({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
      });
      newUser.save(next);
  
    });
  };
  