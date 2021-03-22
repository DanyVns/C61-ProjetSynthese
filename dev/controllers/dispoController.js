
var Event = require('../models/event');
var User = require('../models/user');
var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");
const dispo = require('../models/dispo');


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