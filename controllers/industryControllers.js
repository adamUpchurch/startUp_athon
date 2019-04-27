var Industry    = require('../models/industry'),
    Startup     = require('../models/startup'),
    async       = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = {
    list: (req, res, next) => {
        Industry.find()
            .sort([['name', 'ascending']])
            .exec((error, list_industries) => {
                if(error) { return next(error)}
                console.log(list_industries)
                res.render('industry_list', {title: 'Industry List', industry_list: list_industries})

            })
    },
    detail: (req, res, next) => {
        let id = req.params.id;
        async.parallel({
            industry: function(callback){
                Industry.findById(id)
                .exec(callback)
            },
            startups: function(callback){
                Startup.find({'industry': id})
                    .exec(callback)
            }
        }, function(error, results){
            if(error) return next(error)
            if (results.industry==null) { // No results.
                var err = new Error('Industry not found');
                err.status = 404;
                return next(err);
            }
            console.log(results.industry)
            console.log(results.startups)
            res.render('industry_detail', { title: 'Industry Detail', industry: results.industry, industry_startups: results.startups } );
        })

        
    },
    create_get: (req, res) => {
        res.render('industry_form', {title: 'Create Industry'})
    },
    create_post: [
        // Validate that the name field is not empty.
        body('name', 'Industry name required').isLength({ min: 1 }).trim(),
        sanitizeBody('name').escape(),
        (req, res, next) => {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // Create a industry object with escaped & trimmed data
            var industry = new Industry(
                {name: req.body.name}
            );

            if(!errors.isEmpty()) {
                //Error. Render form again with sanitized values/error message
                res.render('industry_form', { title: 'Create Industry', industry: industry, errors: errors.array()});
                return;
            }
            else {
                // Data from form is valid
                industry.save(err => {
                    if(err) {return next(err)}
                    res.redirect(industry.url)
                })
            }
        }

    ],
    delete_get: (req, res) => {
        async.parallel({
            indsutry: callback => {
                Industry.findById(req.params.id).exec(callback)
            },
            startups: callback => {
                Startup.find({'industry': req.params.id}).exec(callback)
            }
        }, (error, results) => {
            if(error) return next(error)
            if(results.indsutry == null) res.redirect('/catalog/industry')
            res.render('industry_delete', {title: 'Delete Industry', industry: results.indsutry, industry_startups: results.startups})
        })
    },
    delete_post: (req, res) => {
        async.parallel({
            Industry: callback => {
                Industry.findById(req.body.industryid).exec(callback)
            }
        },(error, results) => {
            if(error) return next(error);
            Industry.findByIdAndRemove(req.body.industryid, function deleteIndustry(error) {
                if(error) return next(error)
                res.redirect('/catalog/industries')
            })
        })
    },
    update_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Update Get")
    },
    update_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Update Post")
    },
}