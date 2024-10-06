// googleAuthRouter.js
const { Router } = require('express');
const passport = require('passport');
const googleAuthRouter = Router();

require('../config/passport'); 


googleAuthRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


googleAuthRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    
    res.redirect('/'); 
});

// Logout Route
googleAuthRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = { googleAuthRouter };
