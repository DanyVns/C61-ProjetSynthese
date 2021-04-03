var express = require('express');
var router = express.Router();

var Event = require('../models/event');

var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");



router.post('/test', (req, res) => {

    console.log(req.body);



    if (!mongoose.Types.ObjectId.isValid(req.body.eventID)) {
        req.flash("error", "ID non valide");
        return res.redirect("/index");
    }

    async.parallel({
        event: function (callback) {
            Event.findById(req.body.eventID)
                .populate('owner')
                .exec(callback)
        },
        dispo: function (callback) {
            Dispo.find({ event: req.body.eventID }, 'dispos user')
                .populate('user')
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { 
            console.log(err);
            return next(err); }
        if (results.event == null) {
            req.flash("error", "Évènement n'existe pas");
            return res.redirect("/index");
        }
        results.event.owner.password = "N/A"

        res.send(results);



    })
});

module.exports = router;
