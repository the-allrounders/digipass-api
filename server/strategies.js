'use strict';

const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const uid = require('uid-safe');

const Users = require('./models/user'),
    Organisations = require('./models/organisation'),
    Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt'));

/**
 * With this PassportJS strategy, a request can be checked with a
 * username and password. When correct credentials are passed, a
 * new Bearer token is created and added to the user.
 */
exports.local = new LocalStrategy((username, password, next) => {
    return Promise.resolve(Users.findOne({email: username}))
        .bind({})
        .then(user => {
            if (!user) return next(null, false);
            this.user = user;
            return bcrypt.compareAsync(password, user.password);
        })
        .then(passwordRight => {
            if (!passwordRight) return next(null, false);
            this.user.tokens.push(uid.sync(18));
            this.user.save();
            next(null, this.user);
        })
        .catch(next);
});

/**
 * With this PassportJS strategy, a token can be passed. When
 * a token is passed, the corresponding user or organisation will be returned.
 * When the token isn't found, an error is returned.
 */
exports.bearer = new BearerStrategy((token, next) =>
    Users.findOne({tokens: token})
        .then(user => {
            if(!user) return Organisations.findOne({token: token}).then(organisation => {
                if(!organisation) throw new Error('No user or organisation with this token found');
                organisation.type = 'organisation';
                return organisation;
            });
            user.type = 'user';
            return user;
        })
        .then(object => next(null, object))
        .catch(() => next(null, false))
);