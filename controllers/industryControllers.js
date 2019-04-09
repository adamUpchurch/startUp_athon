var Founder = require('../models/founder')

module.exports = {
    list: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry list")
    },
    detail: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Detail: " + req.params.id)
    },
    create_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Create Get")
    },
    create_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Create Post")
    },
    delete_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Delete Get")
    },
    delete_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Delete Post")
    },
    update_get: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Update Get")
    },
    update_post: (req, res) => {
        res.send("NOT IMPLEMENTED: Industry Update Post")
    },
}