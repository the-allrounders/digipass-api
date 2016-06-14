"use strict";
const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, callback) => {
    require('./../models/user').findOne({email: username, password: password}).then((docs) => {
        callback(null, docs);
    }).catch((error) => {
        callback(error);
    });
}));

router.use(passport.initialize());


router.route('/login').post(passport.authenticate('local', { session: false }), (req, res, next) => {
    // TODO: Create token and return token
    res.send('Authorized');
});

module.exports = router;
