var express     = require('express'),   
    router      = express.Router();

var founder     = require('../controllers/founderControllers'),
    startup     = require('../controllers/startupControllers'),
    industry    = require('../controllers/industryControllers');
    

    //Startup Routes
router.get('/', startup.index)
router.get('/startup/create', startup.create_get)
router.post('/startup/create', startup.create_post)

router.get('/startup/:id/delete', startup.delete_get)
router.post('/startup/:id/delete', startup.delete_post)

router.get('/startup/:id/update', startup.update_get)
router.post('/startup/:id/update', startup.update_post)

router.get('/startup/:id', startup.detail)
router.get('/startups', startup.list)

    //Founder Routes
router.get('/founder/create', founder.create_get)
router.post('/founder/create', founder.create_post)

router.get('/founder/:id/delete', founder.delete_get)
router.post('/founder/:id/delete', founder.delete_post)

router.get('/founder/:id/update', founder.update_get)
router.post('/founder/:id/update', founder.update_post)

router.get('/founder/:id', founder.detail)
router.get('/founders', founder.list)

    //Industry Routes
router.get('/industry/create', industry.create_get)
router.post('/industry/create', industry.create_post)

router.get('/industry/:id/delete', industry.delete_get)
router.post('/industry/:id/delete', industry.delete_post)

router.get('/industry/:id/update', industry.update_get)
router.get('/industry/:id/update', industry.update_post)

router.get('/industry/:id', industry.detail)
router.get('/industries', industry.list)

module.exports = router;