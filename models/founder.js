var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var FounderSchema = new Schema ({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    linkedin_url: {type: String},
});

//Virtual for founder's fullname
FounderSchema
    .virtual('name')
    .get(()=> {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for founder's URL
FounderSchema
    .virtual('url')
    .get(() => {
        return '/catalog/founder/' +this._id
    })

module.exports = mongoose.model('Founder', FounderSchema)