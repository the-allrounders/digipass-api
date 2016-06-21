'use strict';

const userPreferenceCtrl = require('../controllers/userPreference'),
    Permission = require('../models/permission'),
    permissionCtrl = require('../controllers/permission'),
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
            categoryIDs = _.uniqWith(categoryIDs, _.isEqual).map(id => mongoose.Types.ObjectId(id));

            // Resolve all categories
            return promiseWhile(() => categoryIDs.length, () => {

                // Search for all objectIDs
                return Category.find({_id: { $in: categoryIDs}}).then(categories => {

                    // Add results to organisation.categories
                    organisation.categories = organisation.categories || [];
                    organisation.categories = organisation.categories.concat(categories);

                    // Determinate all available and parent categories
                    let available = organisation.categories.map(category => category._id);
                    let parents = organisation.categories.map(category => category.parent[0]);

                    // Determinate all needed categories
                    categoryIDs = _.differenceBy(
                        parents.filter(function(e){return e;}),
                        available.concat(categoryIDs),
                        a => a.toString()).map(id => mongoose.Types.ObjectId(id)
                    );
                });

            }).then(() => organisation);

        }))
        .then(organisations => {
            if(req.query.pauper != 'ian') return organisations;

            // Everything below is just because Ian can't handle normal JSON.
            // To transform, use /requests?pauper=ian

            // Add children permissions to all categories
            organisations.forEach(organisation => organisation.permissions.forEach(permission => {

                // Save all parents in a string array
                let parents = permission.preference.category.map(permissionId => permissionId.toString());

                // While parents have parents
                while(parents.length){


                    var newparents = [];
                    organisation.categories = organisation.categories.map(category => {

                        // If this is not the parent we need, return
                        if(parents.indexOf(category._id.toString()) == -1) return category;

                        // Create new object, fuck mongoose
                        var newcategory = {
                            _id: category._id,
                            title: category.title,
                            description: category.description,
                            icon: category.icon,
                            parent: category.parent,
                            children: category.children || []
                        };

                        // Check if it has parents
                        if(category.parent.length) newparents.push(category.parent[0]);
                        newcategory.children.push({
                            _id: permission._id,
                            status: permission.status
                        });
                        return newcategory;
                    });

                    parents = newparents;

                }
            }));

            // Add all categories to the permissions array
            organisations.forEach(organisation => {
                organisation.permissions = organisation.permissions.map(permission => {
                    permission = permission.toJSON();
                    permission.parent = permission.preference.category;
                    return permission;
                }).concat(organisation.categories);

                organisation.categories = null;
            });

            return organisations;
        })
        .then(permissions => res.json(permissions));
});

router.route('/permissions')
    .get(permissionCtrl.list)
    .post(permissionCtrl.create)
    .put(permissionCtrl.update);

module.exports = router;
