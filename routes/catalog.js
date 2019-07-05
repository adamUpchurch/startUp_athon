var express     = require('express'),   
    router      = express.Router();

var user     = require('../controllers/userController'),
    book     = require('../controllers/bookController');
    
var authCheck = (req, res, next) => {
    console.log(req.user)
    if(req.user._id == req.params.id || req.user._id == '5cd344fdcf6e8085e28e94fd'){
        next()
    } else {
        res.redirect('/')
    }
}
    //Startup Routes
router.get('/', book.index)

router.get('/book/create', book.create_get)
router.post('/book/create', book.create_post)

router.get('/book/:id/delete', book.delete_get)
router.post('/book/:id/delete', book.delete_post)

router.get('/book/:id/update', book.update_get)
router.post('/book/:id/update', book.update_post)

router.get('/book/:id', book.detail)
router.get('/books', book.list)

    //User Routes
router.get('/user/create', user.create_get)
router.post('/user/create', user.create_post)

router.get('/user/:id/delete', authCheck, user.delete_get)
router.post('/user/:id/delete', authCheck, user.delete_post)

router.get('/user/:id/update', authCheck, user.update_get)
router.post('/user/:id/update', authCheck, user.update_post)

router.get('/user/:id', user.detail)
router.get('/users', user.list)

module.exports = router;