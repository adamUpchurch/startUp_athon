var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a user resource');
});

router.get('/:adjective', function(req, res, next) {
  res.render('index', { title: req.params.adjective});
});

module.exports = router;
