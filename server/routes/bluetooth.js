'use strict';

const router = require('express').Router(),
    Organisations = require('../models/organisation'),
    passport = require('passport'),
    Permission = require('../models/permission');

router.route('/').post(passport.authenticate('bearer', {session: false}), (req, res) => {
    if(req.user.type != 'user') return res.status(401).send('Not authenticated as user');

    return Organisations
        .find({devices: {$elemMatch: {bluetooth: req.body.bluetooth}}})
        .then(organisations => {
            organisations = organisations.map(organisation => organisation.toJSON());

            organisations.forEach(organisation => {
                // Remove the token from all the results, it's secret!
                delete organisation.token;

                // Only return the device that is actually used
                organisation.device = organisation.devices.filter(device => device.bluetooth == req.body.bluetooth).pop();
                delete organisation.devices;
            });

            // Return the results
            res.json(organisations);

            // Find all preferences
            organisations.forEach(organisation => organisation.device.preferences.forEach(preference =>

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