'use strict';
const router = require('express').Router(),
    passport = require('passport'),
    Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt'));

const User = require('../models/user');

function returnUserInfo (req, res){
    var bearer = req.user.tokens.slice(-1)[0],
        user = req.user.toJSON();

    delete user.tokens;
    delete user.updatedAt;
    delete user.password;
    delete user.__v;

    // Backwards compatibility
    user.id = user._id;

    res.json({
        Bearer: bearer,
        User: user
    });
}

/**
 * Is used to create a new user.
 */
router.route('/').post((req, res, next) => {
    return bcrypt.hashAsync(req.body.password, 10)
        .then(password => {
            const user = new User({
                email: req.body.username,
                password: password,
                name: {
                    first: req.body.name.first,
                    last: req.body.name.last
                }
            });

            return user.save();
        })
        .then(() => next())
        .catch(err => res.status(400).json(err));
}, passport.authenticate('local', { session: false }), returnUserInfo);

/**
 * Is used to authenticate with a e-mail address and a password.
 * Returns a Bearer token and the user ID.
 */
router.route('/login').post(passport.authenticate('local', { session: false }), returnUserInfo);

/**
 * Is used to test if a bearer is valid.
 * Returns the latest Bearer token and the user ID.
 */
router.route('/test').get(passport.authenticate('bearer', {session: false}), returnUserInfo);

router.use('/:userId', require('./userRoutes'));

module.exports = router;