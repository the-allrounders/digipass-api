"use strict";
const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStategy = require('passport-http-bearer').Strategy;
const uid = require('uid-safe');

passport.use(new LocalStrategy((username, password, callback) => {
    require('./../models/user').findOne({email: username, password: password}).then((docs) => {
        docs.tokens.push(uid.sync(18));
        docs.save();
        callback(null, docs);
    }).catch((error) => {
        callback(error);
    });
}));

passport.use(new BearerStategy((token, callback) => {
    require('./../models/user').findOne({tokens: token}).then((user) => {
        callback(null, user);
    }).catch((error) => {
        callback(error);
    });
}));

router.use(passport.initialize());


router.route('/login').post(passport.authenticate('local', { session: false }), (req, res, next) => {
    // TODO: Create token and return token
    res.json({
        Bearer: req.user.tokens.slice(-1)[0]
    });
});

router.route('/test').post(passport.authenticate('bearer', {session: false}), (req, res, next) => {
    res.send('Authorized');
});

module.exports = router;
