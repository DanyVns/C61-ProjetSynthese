var express = require('express');
var router = express.Router();
var passport = require("passport");



// Les pages controller
var user_controller = require('../controllers/userController');
var event_controller = require('../controllers/eventController');
var schedule_controller = require('../controllers/scheduleController');
var dispo_controller = require('../controllers/dispoController');

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
  res.locals.currentEvent = null;
  res.locals.patate;
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
router.get('/signup', user_controller.user_create_get); 

router.post('/signup', user_controller.user_create_post, 
passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })) // Voir dans le Usercontroller.js




router.get('/index', ensureAuthenticated, event_controller.index); 

router.get('/create_event', ensureAuthenticated, event_controller.create_event_get); 

router.post('/create_event', ensureAuthenticated, event_controller.create_event_post); 



module.exports = router;
