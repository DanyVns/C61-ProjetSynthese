var createError = require('http-errors'); // pour la gestion des erreur 
var express = require('express'); // Express
var path = require('path'); // Pour naviguer dans les dossiers
var bodyParser = require("body-parser"); // pour parse les adresse URL reçue
var cookieParser = require('cookie-parser'); // gestion des cookies
var logger = require('morgan'); // pour afficher des logs dans la console
var mongoose = require("mongoose"); // pour connection à une DB
var flash = require("connect-flash"); // pour place des messages dans les variables de session
var passport = require("passport"); // pour la gestion d'authentification en stockant
var setUpPassport = require("./setuppassport"); // nécessaire pour utiliser passport
var session = require("express-session"); // pour utiliser les variables de sessions

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');


var app = express();
mongoose.connect("mongodb://localhost:27017/testAudience", { useNewUrlParser: true, useUnifiedTopology: true} )
//mongoose.connect("mongodb+srv://dbUser:AAAaaa111@cluster0.dcfkf.mongodb.net/Audience?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true} )
mongoose.set('useCreateIndex', true); // 3 paramètres pour enlever les warning
mongoose.set('useFindAndModify', false);
setUpPassport();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
  })); 

app.use(session({
  secret: "lesecretestdanslasauce",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
