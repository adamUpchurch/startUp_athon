var async = require('async');
var marked = require('marked');

const axios = require('axios')

var Book = require('../models/book'),
    User = require('../models/user');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
    pedantic: true,
    headerIds: false,
    tables: true,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });


module.exports = {
    index: (req, res) => {
        async.parallel({
            book_count: function(cb) {
                Genre.countDocuments({}, cb)
            },
        }, function(err, results) {
            res.render('book', { title: 'book', error: err, data: results });

        } 
        )
    },
    list: (req, res, next) => {
        Book.find({})
            .sort([['last', 'ascending']])
            .populate('title subtitle summary difficulty')
            .exec((err, list_books) => {
                if (err) { return next(err); }
                res.render('book_list', { title: 'Book List', book_list: list_books})
            });
    },
    detail: (req, res) => {
        let id = req.params.id;
        Book.findById(id)
            .exec((err, book)=> {
                if (err) { return next(err); }
                console.log('Book detail')
                console.log(book)
                if(book.post){
                    var book = marked(book.post)
                    console.log('Book Post =====')
                    console.log(post)
                }

                res.render('book_detail', { title: 'Book Detail', book})
            })
    },
    create_get: (req, res, next) => {
        res.render('book_form', {title: 'Book Form'})
    },
    create_post: [
        // Validate fields
        body('title', 'Title must not be empty').isLength({min: 1}).trim(),
        body('story', 'Book not be empty').isLength({min: 1}).trim(),

        //Sanitize
        sanitizeBody('title').escape(),
        sanitizeBody('author').escape(),
        sanitizeBody('summary').escape(),
        sanitizeBody('story').escape(),


        (req, res, next) => {
            const errors = validationResult(req);
            // Create a Book Project
            // Create a Book object with escaped/trimmed data and old id
            var req_book = req.body
            console.log(req_book)

            var book = new Book({
                title: req_book.title,
                author: req_book.author,
                summary: req_book.summary,
                difficulty: req_book.difficulty,
            });

            var textToSplit = req_book.story

            axios.post('http://127.0.0.1:5000/split',{
                'text_to_split': textToSplit,
                })
                .then(resp => {
                // if no error with splitting, add to book object
                // save story

                console.log('==========================================')
                book.story.en = resp.data
                book.save(err => {
                    if(err) {res.render('book_form',  { title: 'Create Book', book: book, errors: errors.array()})}
                    res.redirect(book.url)
                })
            }).catch(error => {
                // error with splitting - currently not return error to user
                console.log('=================== Error=======================')
                console.log(error.response.status)
                console.log(error.response.statusText)
                console.log('=================== Error=======================')

                res.render('book_form',  { title: 'Create Book', book: book})
            });
        }
    ],
    delete_get: (req, res) => {
        async.parallel({
            book: callback => {
                Book.findById(req.params.id).exec(callback)
            },
        }, (error, results) => {
            if(error) return next(error);
            console.log(results)
            if(results.book == null) res.redirect('/catalog/books')
            res.render('book_delete', {title: 'Delete Book', book: results.book})
        })
    },
    delete_post: (req, res) => {
        async.parallel({
            book: callback => {
                Book.findById(req.body.bookid).exec(callback)
            }
        }, (error, results) => {
            if(error) return next(error)
            Book.findByIdAndRemove(req.body.bookid, function deleteBook(error) {
                if(error) return next(error)
                res.redirect('/catalog/books')
            })
        })
    },
    update_get: (req, res) => {
        async.parallel({
            book: function(callback){
                Book.findById(req.params.id).exec(callback)
            },
        },
            function(error, results){
                if(error) { return next(error)}
                if (results.book == null) { // No book to return
                    var err = new Error('Book not found')
                    err.status = 404;
                    return next(err)
                }
                //Success
                // res.json(results)
                res.render('book_form', {title: 'Update Book', book: results.book})
            })
    },
    update_post: [
        (req, res, next) => {
            next();
        },
        // Validate fields
        body('title', 'Title must not be empty').isLength({min: 1}).trim(),
        body('post', 'Business plan must not be empty').isLength({min: 1}).trim(),

        //Sanitize
        sanitizeBody('title').escape(),
        sanitizeBody('subtitle').escape(),
        sanitizeBody('summary').escape(),
        sanitizeBody('story').escape(),

        // Process request after validation and sanitization
        (req, res, next) => {
            const errors = validationResult(req);
            console.log('errors: ' + errors)
            //Create a Book object with escaped/trimmed data and old id
            console.log('POSTING UPDATE')
            console.log(req.body)

            var book = new Book({
                title: req.body.title,
                subtitle: req.body.subtitle,
                summary: req.body.summary,
                summary: req.body.story,
                difficulty: req.body.difficulty,
                story: {
                    en: resp,
                },
                _id: req.params.id //This is required, or a new ID will be assigned.
            });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized value/error messages
            res.render('book_form', {title: 'Update Book', book: book, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record
            Book.findByIdAndUpdate(book._id, book, {}, function(error, thebook) {
                if(error) {return next(error)}
                // Update successful - redirect to book detail
                res.redirect(book.url)
            })
        }
        }
    ]
}
