var express     = require('express'),   
    router      = express.Router(),
    passport    = require('passport');



router.get('/login', (req, res) => {
    res.send('login')
})

router.get('/logout', (req, res) => {
    res.send('logout')
})

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.user.url);
});

module.exports = router;