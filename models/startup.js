var mongoose = require('mongoose');

var Schema = mongoose.Schema

var StartupSchema = new Schema({
    title: {type: String, required: true},
    founder: [{type: Schema.Types.ObjectId, ref: 'Founder', required: true},],
    summary: {type: String, required: true},
    industry: [{type: Schema.Types.ObjectId, ref: "Industry"}],
    status: {type: String, required: true, enum:['Ideation', 'Validation', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'IPO'], default: 'Ideation'},
    web_url: {type: String}
})

// Virtual 
StartupSchema
    .virtual('url')
    .get(function() {
        return '/catalog/startup/' + this._id
    })

StartupSchema
    .virtual('isFunded')
    .get(function(){
        return (this.status != 'Ideation' || this.status != 'Validation') 
    })

// StartupSchema
//     .virtual('founderList')
//     .get( _ => {
//         Startup.findById(this._id, 'founder')
//         .populate('founder')
//         .exec((err, list_founders) => {
//             if (err) { return next(err); }
//             const founders = []
//             list_founders.forEach(founder => {
//                 founders.push(founder.name)
//             });
//             return list_founders.join(', ')
//         });
//     })

module.exports = mongoose.model('Startup', StartupSchema)