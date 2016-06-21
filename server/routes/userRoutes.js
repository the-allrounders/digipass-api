'use strict';

const userPreferenceCtrl = require('../controllers/userPreference'),
    Permission = require('../models/permission'),
    permissionCtrl = require('../controllers/permission'),
    requestCategoryCtrl = require('../controllers/requestCategory');

const router = require('express').Router({mergeParams: true});

router.route('/preferences')
    .get(userPreferenceCtrl.list) /** GET /api/preferences - Get list of preferences */
    .post(userPreferenceCtrl.create); /** POST /api/preferences - Create new preference */

router.route('/preferences/:preferenceId')
    .delete(userPreferenceCtrl.remove); /** DELETE /api/preferences/:preferenceId - Delete preference */

/**
 * This is used to get the list of requests
 */
router.route('/requests').get((req, res) => {
    Permission
        .find({user: req.params.userId})
        .populate('organisation', '_id title icon')
        .populate('preference')
        .then(permissions => {

            // Group by organisation
            var permissionsPerOrganisation = {};
            permissions
                // Map this for easier usage to a {key: _id, object: permission} object}
                .map(permission => ({key: permission.organisation._id, object: permission}))
                .forEach(permission => {
                    // Add key if it does not exist yet in the new array
                    permissionsPerOrganisation[permission.key] = permissionsPerOrganisation[permission.key] || [];

                    // Add permission to new array
                    permissionsPerOrganisation[permission.key].push(permission.object);
                });

            // Create an object that we actually want
            return Object.keys(permissionsPerOrganisation)
                .map(k => ({
                    _id: k,
                    permissions: permissionsPerOrganisation[k],
                    organisation: permissionsPerOrganisation[k][0].organisation
                }));
            
        })
        .then(a => a) // TODO: Add categories
        .then(a => a) // TODO: Add children to all categories
        .then(permissions => res.json(permissions));
});

router.route('/permissions')
    .get(permissionCtrl.list)
    .post(permissionCtrl.create)
    .put(permissionCtrl.update);

router.route('/requestCategories')
    .post(requestCategoryCtrl.create)
    .get(requestCategoryCtrl.list);

module.exports = router;
