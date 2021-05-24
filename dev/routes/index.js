var express = require('express');
var router = express.Router();
var passport = require("passport");



// Les pages controller
var user_controller = require('../controllers/userController');
var event_controller = require('../controllers/eventController');
var schedule_controller = require('../controllers/scheduleController');


// Utilise le module passport pour vérifier que l'usager est authentifié
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "Vous devez être authentifié pour accéder à cette page.");
    res.redirect("/login");
  }
}


router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  res.locals.currentEvent = null;

  next();
});


/* Route login */
router.get(["/", '/login'], function (req, res, next) {
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
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// ****************
// User controller
// ****************
router.get('/signup', user_controller.user_create_get);

router.post('/signup', user_controller.user_create_post,
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })) // Voir dans le Usercontroller.js



// ****************
// Event controller
// ****************

router.get('/index', ensureAuthenticated, event_controller.index);

router.get('/create_event', ensureAuthenticated, event_controller.create_event_get);

router.post('/create_event', ensureAuthenticated, event_controller.create_event_post);

router.get('/join_event/:id/', ensureAuthenticated, event_controller.join_event_get);

router.post('/join_event/:id', ensureAuthenticated, event_controller.join_event_post);

router.get('/generate_schedule/:id',ensureAuthenticated, schedule_controller.create);


module.exports = router;  
