var mongoose = require('mongoose');

var Schema = mongoose.Schema

var BookSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String},
    author: {type: String},
    story: {
        en: [{type: String}],
        es: [{type: String}]
    },
    difficulty: {type: Number, min: 1, max: 5},
    farthest_read: {type: Number},
    recently_read: {type: Number},
    last_read: {type: Date}
})

// Virtual 
BookSchema
    .virtual('url')
    .get(function() {
        return '/catalog/book/' + this._id
    })

module.exports = mongoose.model('Book', BookSchema)