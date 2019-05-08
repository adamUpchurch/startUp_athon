var Founder = require('../models/founder'),
    Startup = require('../models/startup'),
    async   = require('async');

const   { body,validationResult } = require('express-validator/check'),
        { sanitizeBody } = require('express-validator/filter');


module.exports = {
    list: (req, res, next) => {
        Founder.find()
            .sort([['family_name', 'ascending']])
            .exec((err, list_founders)=> {
                if(err) { return next(err)}
                res.render('founder_list', {title: 'Founders', founder_list: list_founders})
            })
    },
    detail: (req, res, next) => {
        let id = req.params.id;
        async.parallel({
            founder: function(cb){
                Founder.findById(id)
                    .exec(cb)
            },
            startup: function(cb){
                Startup.find({'founder': id})
                    .exec(cb)
            },
        }, function(err, result) {
            if(err) { return next(err)}
            console.log(result)
            res.render('founder_detail', {title: 'Founder', founder: result.founder, startups: result.startup})
        })
        },
    create_get: (req, res) => {
        res.render('founder_form', {title: 'Create Founder'})
    },
    create_post: [
        // Validate that the name field is not empty.
        body('first_name', 'Founder name required').isLength({ min: 1 }).trim()
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        body('family_name', 'Founder name required').isLength({ min: 1 }).trim()
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

        sanitizeBody('first_name').escape(),
        sanitizeBody('family_name').escape(),
        sanitizeBody('personality').escape(),

        (req, res, next) => {
            console.log('Creating new founder!')
            console.log(req.body)
            // Extract the validation errors from a request.
            const errors = validationResult(req);
            const newFounder = req.body
            // Create a founder object with escaped & trimmed data
            var founder = new Founder({
                first_name: newFounder.first_name,
                family_name: newFounder.family_name,
                personality: newFounder.personality
                });

            if(!errors.isEmpty()) {
                //Error. Render form again with sanitized values/error message
                res.render('founder_form', { title: 'Create Founder', founder: founder, errors: errors.array()});
                return;
            }
            else {
                // Data from form is valid
                founder.save(err => {
                    if(err) {return next(err)}
                    res.redirect(founder.url)
                })
            }
        }

    ],
    delete_get: (req, res) => {
        async.parallel({
            founder: function(callback){
                Founder.findById(req.params.id).exec(callback)
            },
            startups: function(callback){
                Startup.find({'founder': req.params.id}).exec(callback)
            },
        }, function(error, results) {
            if(error) {return next(error)}
            if (results.founder == null) {
                res.redirect('/catalog/founders')
            }
            res.render('founder_delete', {title: 'Delete Author', founder: results.founder, startups: results.startups})
        })
    },
    delete_post: (req, res, next) => {
        async.parallel({
            founder: function(callback){
                Founder.findById(req.body.founderid).exec(callback)
            },
        },  (error, results) => {
            if(error) {            
                return next(error)}
            else {
                Founder.findByIdAndRemove(req.body.founderid, function deleteFounder(error) {
                    if(error) {                        
                        return next(error)
                    }
                    res.redirect('/catalog/founders')
                })
            }
        })
    },
    update_get: (req, res) => {
        async.parallel({
            founder: function(callback){
                Founder.findById(req.params.id).exec(callback)
            },
            startups: function(callback){
                Startup.find({'founder': req.params.id}).exec(callback)
            },
        }, function(error, results) {
            if(error) {return next(error)}
            if (results.founder == null) {
                res.redirect('/catalog/founders')
            }
            res.render('founder_form', {title: 'Update Author', founder: results.founder, startups: results.startups})
        })
    },
    update_post: [
            // Validate that the name field is not empty.
            body('first_name', 'Founder name required').isLength({ min: 1 }).trim()
                .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
            body('family_name', 'Founder name required').isLength({ min: 1 }).trim()
                .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    
            sanitizeBody('first_name').escape(),
            sanitizeBody('family_name').escape(),
            sanitizeBody('personality').escape(),
            sanitizeBody('linkedin_url').escape(),
            sanitizeBody('portfolio_url').escape(),
    
            (req, res, next) => {
                console.log('Creating new founder!')
                console.log(req.body)
                // Extract the validation errors from a request.
                const errors = validationResult(req);
                const newFounder = req.body
                // Create a founder object with escaped & trimmed data
                var founder = new Founder(
                    { 
                    first_name: newFounder.first_name,
                    family_name: newFounder.family_name,
                    linkedin_url: newFounder.linkedin_url,
                    portfolio_url: newFounder.portfolio_url,
                    personality: newFounder.personality,
                    _id:req.params.id //This is required, or a new ID will be assigned!
                    });
    
                if(!errors.isEmpty()) {
                    //Error. Render form again with sanitized values/error message
                    res.render('founder_form', { title: 'Create Founder', founder: founder, errors: errors.array()});
                    return;
                }
                else {
                    // Data from form is valid. Update the record.
                    Founder.findByIdAndUpdate(founder._id, founder, {}, function (err,UpdatedFounder) {
                        if (err) { return next(err); }
                            // Successful - redirect to book detail page.
                            res.redirect(UpdatedFounder.url);
                        });
                }
            }
        ],
}