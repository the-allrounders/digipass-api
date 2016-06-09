const UserPreference = require('../models/userPreference');
const mongoose = require('mongoose');

/**
 * Create new userPreference
 * @property {string} req.body.userPreferencename - The userPreferencename of userPreference.
 * @property {string} req.body.mobileNumber - The mobileNumber of userPreference.
 * @returns {UserPreference}
 */
function create(req, res, next) {
    var userPref;
    const id = mongoose.Types.ObjectId(req.body.preference);
    const userId = mongoose.Types.ObjectId(req.params.userId);
    UserPreference.getPreferenceById(id, userId).then((p) => {
        if(typeof req.body.values == String) {
            const values = req.body.values.split(",").map(Number);
        }
        if (p.length > 0) {
            userPref = p[0];
            userPref.values = values;

            userPref.saveAsync()
                .then((savedUserPreference) => res.json(savedUserPreference))
                .error((e) => next(e));
        } else {
            userPref = new UserPreference({
                preference: req.body.preference,
                user: req.params.userId,
                values: req.body.values
            });

            userPref.saveAsync()
                .then((savedUserPreference) => res.json(savedUserPreference))
                .error((e) => next(e));
        }
    }).error((e) => console.log(e));
}

/**
 * Get userPreference list.
 * @property {number} req.query.skip - Number of userPreferences to be skipped.
 * @property {number} req.query.limit - Limit number of userPreferences to be returned.
 * @returns {UserPreference[]}
 */
function list(req, res, next) {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    UserPreference.list(userId).then((userPreferences) =>	res.json(userPreferences))
        .error((e) => next(e));
}

/**
 * Delete userPreference.
 * @returns {UserPreference}
 */
function remove(req, res, next) {
    const userPreference = req.userPreference;
    userPreference.removeAsync()
        .then((deletedUserPreference) => res.json(deletedUserPreference))
        .error((e) => next(e));
}

module.exports = { create, list, remove };
