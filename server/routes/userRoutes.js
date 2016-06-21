'use strict';

const userPreferenceCtrl = require('../controllers/userPreference'),
    Permission = require('../models/permission'),
    permissionCtrl = require('../controllers/permission'),
    requestCategoryCtrl = require('../controllers/requestCategory'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Category = require('../models/category'),
    promiseWhile = require('../../utils/promiseWhile'),
    Promise = require('bluebird');

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
            var permissionsPerOrganisation = _.groupBy(permissions, permission => permission.organisation._id);

            // Create an object that we actually want
            return Object.keys(permissionsPerOrganisation)
                .map(organisationID => ({
                    _id: organisationID,
                    permissions: permissionsPerOrganisation[organisationID],
                    organisation: permissionsPerOrganisation[organisationID][0].organisation
                }));
            
        })
        .then(organisations => Promise.map(organisations, organisation => {

            // Get the first categories
            let categoryIDs = [];
            organisation.permissions.forEach(permission =>
                categoryIDs = categoryIDs.concat(permission.preference.category)
            );
            categoryIDs = _.uniqWith(categoryIDs, _.isEqual);

            // Resolve all categories
            return promiseWhile(() => _.some(categoryIDs, String), () => {

                // Convert categoryIDs to objectIDs for Mongoose
                var objectIDs = _.filter(categoryIDs, String).map(id => mongoose.Types.ObjectId(id));

                // Search for all objectIDs
                return Category.find({_id: { $in: objectIDs}}).then(categories => {

                    // Add results to organisation.categories
                    organisation.categories = organisation.categories || [];
                    organisation.categories = organisation.categories.concat(categories);

                    // Determinate all available and parent categories
                    let available = organisation.categories.map(category => category._id);
                    let parents = organisation.categories.map(category => category.parent[0]);

                    // Determinate all needed categories
                    categoryIDs = _.difference(parents, available, categoryIDs).filter(function(e){return e;});
                });

            }).then(() => organisation);
        }))
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
