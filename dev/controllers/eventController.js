
var Event = require('../models/event');
var User = require('../models/user');
var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");


exports.index = function(req, res) {
    var data = [];
    async.parallel({
        user_count: function(callback) {
            User.countDocuments({}, callback); // test pour compter le nombre d'usager
        },
        event_owner: function(callback) {
            Event.find({
                owner: req.user._id}).exec(callback);
        },   
        event_count_user: function(callback) {
            var agg = [
                {$group: {
                  _id: "$event",                
                  
                  total: {$sum: 1}
                }}
              ];
              Dispo.aggregate(agg).exec(callback)
        }   ,
       
        dispo_event: function(callback) {
            Dispo.find({ user: req.user._id}, 'event')          
                .populate('event')      
                .exec(callback);
        }       
        
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
    req.flash("info", "Évènement créé avec l'identifiant : " + newEvent._id);
    res.locals.currentEvent = newEvent;
    res.redirect("/index");
    

    
};

exports.join_event_get = function(req, res, next) {   
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
        res.render('join_event', { title: "Audience - joindre évènement", event: results.event, dispo: results.dispo });
    });
};

exports.join_event_post = function(req, res) {   
    
    var dispos = []
    for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
            if(req.body[key] == "checked")
                dispos.push(key)
        }
    }    

    var query = { event: req.session.currentEvent._id,
        user: req.user._id };
    var update = {        dispos: dispos,
        event: req.session.currentEvent._id,
        user: req.user._id,
        preference: false };
    var options = {upsert: true, new: true};

    // Cherche si une dispo existe, la modifie, sinon la créée
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    console.log(dispos.length);
    if(dispos.length != 0){
        console.log("je suis ici");
        Dispo.findOneAndUpdate(query, update, options, function(error, result){
            if (error){
                req.flash("error", "Erreur dans la recherche de dispo"); 
                res.redirect("/index");
            }         
            if(!result){
                var result = new Dispo({
                    dispos: dispos,
                    event: req.session.currentEvent._id,
                    user: req.user._id,
                    preference: false
                });
            }
            result.save(function(error) {
                if (error) {
                req.flash("error", "Erreur dans l'enregistrement des dispos"); 
                res.redirect("/index");
            } })
            
        });
        
        
        
        req.flash("info", "Données enregistrées");
    }
    else { // si plus de disponibilités, supprimer le document
        Dispo.find(query).deleteOne().exec()
        req.flash("info", "Disponibilités supprimées");
    }
        
  res.redirect("/index");

};
