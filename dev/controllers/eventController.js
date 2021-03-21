
var Event = require('../models/event');
var User = require('../models/User');
var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");


exports.index = function(req, res) {

    async.parallel({
        user_count: function(callback) {
            User.countDocuments({}, callback); // test pour compter le nombre d'usager
        },
        
    }, function(err, results) {        
        res.render('index', { title: 'Audience', error: err, data: results });
    });
};

exports.create_event_get = function(req, res) {   
        res.locals.created = false; 
        res.render('create_event', { title: 'Audience' });
};

exports.create_event_post = function(req, res, next) {
    res.locals.created = true; 

    var title = req.body.title;
    var description = req.body.description;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var limit_date = req.body.limit_date;  


        var newEvent = new Event({
            nom: title,
            description: description,
            owner: req.user._id,
            start_date: start_date,
            end_date: end_date,
            start_time: start_time,
            end_time: end_time,
            limit_date: limit_date

      });
      newEvent.save();    

    res.locals.currentEvent = newEvent;
    res.render('create_event', { title: 'Audience', newEvent: newEvent });
    

    
};

exports.join_event_get = function(req, res, next) {   
    if( !mongoose.Types.ObjectId.isValid(req.params.id) ){
        req.flash("error", "ID non valide");
        return res.redirect("/index");
    } 

    async.parallel({
        event: function(callback) {
            Event.findById(req.params.id)
              .exec(callback)
        },
        dispo: function(callback) {
            Dispo.findOne({event: req.params.id,
                user: req.user._id}, 'dispos').exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); } 
        if (results.event==null) { 
            req.flash("error", "Évènement n'existe pas");
            return res.redirect("/index");
        }
       
        req.session.currentEvent = results.event
        res.render('join_event', { title: "Audience - joindre évènement", event: results.event, dispo: results.dispo.dispos });
    });
};
