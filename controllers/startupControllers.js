var async = require('async');

var Founder = require('../models/founder'),
    Startup = require('../models/startup'),
    Industry = require('../models/industry');    

module.exports = {
    index: (req, res) => {
        async.parallel({
            founder_count: function(cb) {
                Founder.countDocuments({}, cb)
            },
            startup_count: function(cb) {
                Startup.countDocuments({}, cb)
            },
            industry_count: function(cb) {
                Industry.countDocuments({}, cb)
            },
        }, function(err, results) {
            res.render('index', { title: 'startUp_athon', error: err, data: results });

        } 
        )
    },
    list: (req, res, next) => {
        Startup.find({}, 'title founder')
            .populate('founder')
            .exec((err, list_startups) => {
                if (err) { return next(err); }
                res.render('startup_list', { title: 'Startup List', startup_list: list_startups})
            });
    },
    detail: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Detail: " + req.params.id)
    },
    create_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Create Get")
    },
    create_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Create Post")
    },
    delete_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Delete Get")
    },
    delete_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Delete Post")
    },
    update_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Update Get")
    },
    update_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Update Post")
    },
}