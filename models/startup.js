var mongoose = require('mongoose');

var Schema = mongoose.Schema

var StartupShema = new Schema({
    title: {type: String, required: true},
    founder: [{type: Schema.Types.ObjectId, ref: 'Author', required: true},],
    summary: {type: String, required: true},
    industry: [{type: Schema.Types.ObjectId, ref: "Industry"}],
    status: {type: String, required: true, enum:['Ideation', 'Validation', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'IPO'], default: 'Ideation'},
    web_url: {type: String}
})

// Virtual 
StartupShema
    .virtual('url')
    .get( _ => {
        return '/catalog/startups' + this._id
    })

StartupShema
    .virtual('isFunded')
    .get( _ => {
        return (this.status != 'Ideation' || this.status != 'Validation') 
    })

module.exports = mongoose.model('Startup', StartupShema)