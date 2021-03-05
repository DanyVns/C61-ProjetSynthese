var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


/* Route home page */
router.get(['/', '/login'], function(req, res, next) {
  res.render('login', { title: 'Audience' });
});

/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Audience' });
});

module.exports = router;
