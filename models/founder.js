var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var FounderSchema = new Schema ({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    linkedin_url: {type: String, max: 100},
    portfolio_url: {type: String, max: 100},
    startup: [{type: Schema.Types.ObjectId, ref: 'Startup', required: false},],
    personality: {type: String, enum:['INTJ', 'INTP', 'ENTJ', 'ENTP','INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTF', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']},
    
});

//Virtual for founder's fullname
FounderSchema
    .virtual('name')
    .get(function() {
        console.log(this.family_name + ', ' + this.first_name)
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for founder's URL
FounderSchema
    .virtual('url')
    .get(function(){
        return '/catalog/founder/' +this._id
    })

module.exports = mongoose.model('Founder', FounderSchema)