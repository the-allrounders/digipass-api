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

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    require('./../models/user').findOne({_id: id}).then(() => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

router.use(passport.initialize());
router.use(passport.session());


router.route('/login').post(passport.authenticate('local'), (req, res, next) => {
    // TODO: Create token and return token
    res.send('Authorized');
});

module.exports = router;
