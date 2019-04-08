var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var IndustrySchema = new Schema ({
    name: {type: String, required: true, max: 100},
});

// Virtual for industry's URL
IndustrySchema
    .virtual('url')
    .get(() => {
        return '/catalog/founder/' +this._id
    })

module.exports = mongoose.model('Industry', IndustrySchema)