var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var FounderSchema = new Schema ({
    first_name: {type: String, max: 100},
    family_name: {type: String, max: 100},
    username: {type: String, max: 100},
    googleID: {type: String},
    linkedin_url: {type: String, max: 100},
    portfolio_url: {type: String, max: 100},
    profile_pic: {type: String},
    startup: [{type: Schema.Types.ObjectId, ref: 'Startup', required: false},],
    skills: [{type: String}],
    personality: {type: String, enum:['INTJ', 'INTP', 'ENTJ', 'ENTP','INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTF', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']},
});

//Virtual for founder's fullname
FounderSchema
    .virtual('name')
    .get(function() {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for founder's URL
FounderSchema
    .virtual('url')
    .get(function(){
        return '/catalog/founder/' +this._id
    })

// Virtual for founder's URL
FounderSchema
    .virtual('basic_info')
    .get(function(){
        let thisFounder = {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            googleID: this.googleID,
            username: this.username,
        }
        return JSON.stringify(thisFounder)
    })

FounderSchema
    .virtual('description')
    .get(function(){
        return `${this.personality}, has participated in ${this.startup.length} startup(s)`
    })


module.exports = mongoose.model('Founder', FounderSchema)