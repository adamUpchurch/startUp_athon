var Startup = require('../models/founder')

module.exports = {
    index: (req, res) =>{
        res.send('NOT IMPLEMENTED: Startup Home Page')
    },
    list: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup list")
    },
    detail: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Detail: " + req.params.id)
    },
    create_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Create Get")
    },
    create_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Create Post")
    },
    delete_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Delete Get")
    },
    delete_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Delete Post")
    },
    update_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Update Get")
    },
    update_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Startup Update Post")
    },
}