"use strict";
const router = require('express').Router();
const passport = require('passport');

const User = require('../models/user');

/**
 * Is used to test if a bearer is valid.
 * Returns `Authorized` or `Unauthorized`.
 */
router.route('/test').post(passport.authenticate('bearer', {session: false}), (req, res, next) =>
    res.json({
        User: {
            id: req.user.id
        }
    })
);

/**
 * Is used to create a new user.
 */
router.route('/').post((req, res, next) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password,
        name: {
            first: req.body.name.first,
            last: req.body.name.last
        }
    });

    user.save()
        .then(() => next())
        .catch(err => res.status(400).json(err));
});

/**
 * Is used to authenticate with a e-mail address and a password.
 * Returns a Bearer token.
 */
router.route(['/', '/login']).post(passport.authenticate('local', { session: false }), (req, res, next) =>
    res.json({
        Bearer: req.user.tokens.slice(-1)[0],
        User: {
            id: req.user.id
        }
    })
);

router.use('/:userId', require('./userRoutes'));

module.exports = router;