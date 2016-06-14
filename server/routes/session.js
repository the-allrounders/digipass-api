"use strict";
const router = require('express').Router();
const passport = require('passport');


router.route('/login').post(passport.authenticate('local', { session: false }), (req, res, next) => {
    res.json({
        Bearer: req.user.tokens.slice(-1)[0]
    });
});

router.route('/test').post(passport.authenticate('bearer', {session: false}), (req, res, next) => {
    res.send('Authorized');
});

module.exports = router;
