var Founder = require('../models/founder')

module.exports = {
    list: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder list")
    },
    detail: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Detail: " + req.params.id)
    },
    create_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Create Get")
    },
    create_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Create Post")
    },
    delete_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Delete Get")
    },
    delete_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Delete Post")
    },
    update_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Update Get")
    },
    update_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Founder Update Post")
    },
}