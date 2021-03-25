var Event = require('../models/event');
var User = require('../models/user');
var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");



exports.create = function(req, res, next) {       
    
    if( !mongoose.Types.ObjectId.isValid(req.params.id) ){
        req.flash("error", "ID non valide");
        return res.redirect("/index");
    } 

    async.parallel({
        event: function(callback) {
            Event.findById(req.params.id)
            .populate('owner')
            .exec(callback)
        },
  
    }, function(err, results) {
        if (err) { return next(err); } 
        if (results.event==null) { 
            req.flash("error", "Évènement n'existe pas");
            return res.redirect("/index");
        }

        results.event.owner.password = "N/A"
       
        req.session.currentEvent = results.event        
        res.render('create_schedule', { title: "Test", event : req.session.currentEvent });
    }
    )};
