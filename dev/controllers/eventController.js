
var Event = require('../models/event');
var User = require('../models/User');
var async = require('async');


exports.index = function(req, res) {

    async.parallel({
        user_count: function(callback) {
            User.countDocuments({}, callback); // test pour compter le nombre d'usager
        },
        
    }, function(err, results) {        
        res.render('index', { title: 'Audience', error: err, data: results });
    });
};