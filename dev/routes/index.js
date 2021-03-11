var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require('../models/user');

// Les pages controller
var user_controller = require('../controllers/userController');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "Vous devez être authentifié pour accéder à cette page.");
    res.redirect("/login");
  }
}


router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


/* Route login */
router.get(["/",'/login'], function(req, res, next) {
  if (req.isAuthenticated())
    res.redirect("/index");
  else
    res.render('login', { title: 'Audience' });
});

router.post('/login', passport.authenticate("login", {
  successRedirect: "/index",
  failureRedirect: "/login",
  failureFlash: true
}));

/* Route logout */
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

/* Route signup. */
router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Audience' });
});

router.post('/signup', user_controller.user_create_post, 
passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })) // Voir dans le Usercontroller.js




router.get('/index', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Audience' });
});




module.exports = router;
