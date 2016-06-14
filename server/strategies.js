"use strict";

const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const uid = require('uid-safe');

const Users = require('./models/user');

/**
 * With this PassportJS strategy, a request can be checked with a
 * username and password. When correct credentials are passed, a
 * new Bearer token is created and added to the user.
 */
exports.local = new LocalStrategy((username, password, next) =>
    Users.findOne({email: username, password: password})
        .then(user => {
            if(!user) return next(null, false);
            user.tokens.push(uid.sync(18));
            user.save();
            next(null, user);
        })
        .catch(next)
);

/**
 * With this PassportJS strategy, a token can be passed. When
 * a token is passed, the corresponding user will be returned.
 * When the token isn't found, an error is returned.
 */
exports.bearer = new BearerStrategy((token, next) =>
    Users.findOne({tokens: token})
        .then(user => next(null, user))
        .catch(next)
);