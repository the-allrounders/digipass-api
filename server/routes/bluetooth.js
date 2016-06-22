'use strict';

const router = require('express').Router(),
    Organisations = require('../models/organisation'),
    passport = require('passport'),
    Permission = require('../models/permission');

router.route('/').post(passport.authenticate('bearer', {session: false}), (req, res) => {
    if(req.user.type != 'user') return res.status(401).send('Not authenticated as user');

    Organisations
        .find({devices: {$elemMatch: {bluetooth: req.body.bluetooth}}})
        .then(organisations => {

            // Remove the token from all the results, it's secret!
            organisations.forEach(result => result.token = null);

            // Return the results
            res.json(organisations);

            // Find all preferences
            organisations.forEach(organisation => organisation.devices[0].preferences.forEach(preference =>

                // Search for permission
                Permission.findOne({preference: preference}).then(permission => {

                    if (!permission) {
                        // If the permission does not exist, create it
                        permission = new Permission({
                            preference: preference,
                            user: req.user._id,
                            organisation: organisation._id,
                            status: 'pending'
                        });
                    }

                    permission.lastRequestedAt = Date.now;

                    permission.save();

                })
            ));

        });
});

module.exports = router;