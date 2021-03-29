#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Dispo = require('./models/dispo')
var Event = require('./models/event')
var User = require('./models/user')



var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://dbUser:AAAaaa111@cluster0.dcfkf.mongodb.net/Audience?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dispos = []
var events = []
var users = []
var bookinstances = []


// $2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC == password hash
function userCreate(email, password, firstname, lastname, cb) {
  userdetail = {firstname:firstname , lastname: lastname, password: password, email:email }

  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err,null)      
      return
    }
    console.log('New user: ' + user);
    users.push(user);

    cb(null, user);
    
  }  );
}

function eventCreate(nom, description, start_date, end_date, cb ) {
  eventdetail = {
    nom: nom,
    description: description, 
    owner: "605d431dd003c55de4cead5f",
    start_date: start_date,
    end_date:end_date,
    start_time: 08,
    end_time: 17,
    limit_date: 2021-08-08 
  }

  
  var event = new Event(eventdetail);
       
  event.save(function (err) {
    if (err) {
      cb(err,null);      
      return
    }
    console.log('New event: ' + event);
    events.push(event);

    cb(null, event);
    
  }  );
}

function dispoCreate(event, user, dispos, cb) {
  dispodetail = {
    event : event,
    user: user,
    dispos : dispos,
    preference: false
  }

  
  var dispo = new Dispo(dispodetail);
       
  dispo.save(function (err) {
    if (err) {
      cb(err, null)
      console.log(err);
      return
    }
    console.log('New dispo: ' + dispo);
    dispos.push(dispo);

    cb(null, event);
    
  }  );
}

function createEvents(cb) {
  async.series([
    function(callback) {
      eventCreate('Test Quinze Participants - 4 jours complet', "évènement test avec populate", "2021-03-10", "2021-03-13", callback)
    }, 
      
      
      ],
      // optional callback
      cb);
}





function createUsers(cb) {
    async.series([
      function(callback) {
        userCreate('5@5.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
        'Cinquo', "Test", callback);
      }, 
        function(callback) {
          userCreate('6@6.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Six', "Test", callback);
        }, 
        function(callback) {
          userCreate('7@7.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Seven', "Test", callback);
        }, 
        function(callback) {
          userCreate('8@8.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Eight', "Test", callback);
        }, 
        function(callback) {
          userCreate('9@9.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Nine', "Test", callback);
        }, 
        function(callback) {
          userCreate('10@10.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Dix', "Test", callback);
        }, 
        function(callback) {
          userCreate('11@11.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Onzion', "Test", callback);
        }, 
        function(callback) {
          userCreate('12@12.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Douza', "Test", callback);
        }, 
        function(callback) {
          userCreate('13@13.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Trieze', "Test", callback);
        }, 
        function(callback) {
          userCreate('14@14.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Quaaaartoze', "Test", callback);
        }, 
        function(callback) {
          userCreate('15@15.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Quinnnnzee', "Test", callback);
        }, 
        function(callback) {
          userCreate('16@16.com', '$2a$10$mZ3XXKTsfS1N1kRGuTJkMOhpdWuYkmnsc75CX76BtDKcgyVn.zDTC', 
          'Sèze', "Test", callback);
        }, 
        
        ],
        // optional callback
        cb);
}


function createDispo(cb) {
  async.series([
    function(callback) {
      dispoCreate(events[0], users[0], ["202103100800", "202103100900"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[1], ["202103101000", "202103101100"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[2], ["202103101200", "202103101300"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[3], ["202103101400", "202103101500"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[4], ["202103101600", "202103101700"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[5], ["202103110800", "202103110900"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[6], ["202103111000", "202103100900"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[7], ["202103111100", "202103100900"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[8], ["202103111500", "202103111700"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[9], ["202103120900", "202103121200"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[10], ["202103121500", "202103121700"], callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[11], ["202103130900", "202103131100"],callback)
    }, 
    function(callback) {
      dispoCreate(events[0], users[12], ["202103131600", "202103131400"], callback)
    }, 

      
      
      ],
      // optional callback
      cb);
}




async.series([
    createUsers,
    createEvents,
    createDispo


],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Terminé sans erreur!');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
