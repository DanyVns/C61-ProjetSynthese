var Event = require('../models/event');
var User = require('../models/user');
var Dispo = require('../models/dispo');
var async = require('async');
var mongoose = require("mongoose");



exports.create = function(req, res, next) {             

        res.render('create_schedule', { title: "Audience - à venir" });

};