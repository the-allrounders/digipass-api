import UserPreference from '../models/userPreference';

/**
 * Create new userPreference
 * @property {string} req.body.userPreferencename - The userPreferencename of userPreference.
 * @property {string} req.body.mobileNumber - The mobileNumber of userPreference.
 * @returns {UserPreference}
 */
function create(req, res, next) {
    const preferenceId = req.body.preference;
    let userPref;

    UserPreference.getPreferenceById(preferenceId).then((userPreference) => {
        console.log('update: ', userPreference);
        userPreference.values = req.body.values;
        userPref = userPreference;
    }).error((e) => {
        console.log('new', e);
        userPref = new UserPreference({
            preference: req.body.preference,
            user: res.param.userId,
            values: req.body.values
        });
    });

    userPref.saveAsync()
        .then((savedUserPreference) => res.json(savedUserPreference))
        .error((e) => next(e));
}

/**
 * Get userPreference list.
 * @property {number} req.query.skip - Number of userPreferences to be skipped.
 * @property {number} req.query.limit - Limit number of userPreferences to be returned.
 * @returns {UserPreference[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    UserPreference.list({ limit, skip }).then((userPreferences) =>	res.json(userPreferences))
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

export default { create, list, remove };
