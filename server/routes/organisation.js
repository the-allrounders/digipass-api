'use strict';

const organisationCtrl = require('../controllers/organisation');

const router = require('express').Router(),
    Permission = require('../models/permission'),
    _ = require('lodash'),
    passport = require('passport');

router.route('/')
    .get(organisationCtrl.list) /** GET /api/organisations - Get list of organisations */
    .post(organisationCtrl.create); /** POST /api/organisations - Create new organisation */

router.route('/:organisationId')
    .get(organisationCtrl.get) /** GET /api/organisations/:organisationId - Get organisation */
    .put(organisationCtrl.update) /** PUT /api/organisations/:organisationId - Update organisation */
    .delete(organisationCtrl.remove); /** DELETE /api/organisations/:organisationId - Delete organisation */

router.get('/:organisationId/users', passport.authenticate('bearer', {session: false}), (req, res) => {
    if(req.user.type != 'organisation') return res.status(401).send('Not authenticated as organisation');
    Permission
        .find({organisation: req.params.organisationId/*, status: 'approved'*/}, '_id user lastRequestedAt')
        .sort('lastRequestedAt')
        .populate('user', '_id name')
        .then(permissions => {
            permissions = permissions.map(permission => permission.toJSON());
            var users = _.groupBy(permissions, permission => permission.user._id);
            var newUsers = [];
            for(var user in users){
                newUsers.push({
                    user: users[user][0].user,
                    lastRequestedAt: users[user][0].lastRequestedAt
                });
            }
            res.json(newUsers);
        });
});

/** Load organisation when API with organisationId route parameter is hit */
router.param('organisationId', organisationCtrl.load);

module.exports = router;
