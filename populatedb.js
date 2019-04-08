#! /usr/bin/env node

console.log('This script populates some test startups, founder & industries to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Startup = require('./models/startup')
var Founder = require('./models/founder')
var Industry = require('./models/industry')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var founders = []
var industries = []
var startups = []

function founderCreate(first_name, family_name, cb) {
  founderdetail = {first_name:first_name , family_name: family_name }
  
  var founder = new Founder(founderdetail);
       
  founder.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Founder: ' + founder);
    founders.push(founder)
    cb(null, founder)
  }  );
}

function industryCreate(name, cb) {
  var industry = new Industry({ name: name });
       
  industry.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Industry: ' + industry);
    industries.push(industry)
    cb(null, industry);
  }   );
}

function startupCreate(title, summary, founders, industry, cb) {
  startupdetail = { 
    title: title,
    summary: summary,
    founder: [founders],
  }
  if (industry != false) startupdetail.industry = industry
    
  var startup = new Startup(startupdetail);    
  startup.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Startup: ' + startup);
    startups.push(startup)
    cb(null, startup)
  }  );
}

function createIndustryFounders(cb) {
    async.series([
        function(callback) {
          founderCreate('Patrick', 'Rothfuss', callback);
        },
        function(callback) {
          founderCreate('Ben', 'Bova', callback);
        },
        function(callback) {
          founderCreate('Isaac', 'Asimov', callback);
        },
        function(callback) {
          founderCreate('Bob', 'Billings', callback);
        },
        function(callback) {
          founderCreate('Jim', 'Jones', callback);
        },
        function(callback) {
          industryCreate("Technology", callback);
        },
        function(callback) {
          industryCreate("Manufactoring", callback);
        },
        function(callback) {
          industryCreate("Services", callback);
        },
        ],
        // optional callback
        cb);
}


function createStartups(cb) {
    async.parallel([
        function(callback) {
          startupCreate('Wind', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', [founders[0]], [industries[0]], callback);
        },
        function(callback) {
          startupCreate("Wise", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', [founders[0]], [industries[0]], callback);
        },
        function(callback) {
          startupCreate("Slow Regard", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', [founders[0]], [industries[0]], callback);
        },
        function(callback) {
          startupCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", [founders[1]], [industries[1]], callback);
        },
        function(callback) {
          startupCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", [founders[1], ], [industries[1],], callback);
        },
        function(callback) {
          startupCreate('Test Startup 1', 'Summary of test startup 1', [founders[2], founders[4]], [industries[0],industries[1]], callback);
        },
        function(callback) {
          startupCreate('Test Startup 2', 'Summary of test startup 2', [founders[1], founders[3]], false, callback)
        }
        ],
        // optional callback
        cb);
}

async.series([
    createIndustryFounders,
    createStartups
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});