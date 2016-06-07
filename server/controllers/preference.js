import Preference from '../models/preference';

/**
 * Load preference and append to req.
 */
function load(req, res, next, id) {
    Preference.get(id).then((preference) => {
        req.preference = preference;
        return next();
    }).error((e) => next(e));
}

/**
 * Get preference
 * @returns {Preference}
 */
function get(req, res) {
    return res.json(req.preference);    
}

/**
 * Create new preference
 * @property {string} req.body.preferencename - The preferencename of preference.
 * @property {string} req.body.mobileNumber - The mobileNumber of preference.
 * @returns {Preference}
 */
function create(req, res, next) {

    const preference = new Preference({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        category: req.body.category,
        icon: req.body.icon,
        values: req.body.values
    });

    preference.saveAsync()
        .then((savedPreference) => res.json(savedPreference))
        .error((e) => next(e));
}

/**
 * Update existing preference
 * @property {string} req.body.preferencename - The preferencename of preference.
 * @property {string} req.body.mobileNumber - The mobileNumber of preference.
 * @returns {Preference}
 */
function update(req, res, next) {
    const preference = req.preference;
    preference.title = req.body.title;
    preference.description = req.body.description;
    preference.category = req.body.category;
    preference.type = req.body.type;
    preference.icon = req.body.icon;
    preference.values = req.body.values;

    preference.saveAsync()
        .then((savedPreference) => res.json(savedPreference))
        .error((e) => next(e));
}

/**
 * Get preference list.
 * @property {number} req.query.skip - Number of preferences to be skipped.
 * @property {number} req.query.limit - Limit number of preferences to be returned.
 * @returns {Preference[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Preference.list({ limit, skip }).then((preferences) => res.json(preferences))
        .error((e) => next(e));
}

/**
 * Delete preference.
 * @returns {Preference}
 */
function remove(req, res, next) {
    const preference = req.preference;
    preference.removeAsync()
        .then((deletedPreference) => res.json(deletedPreference))
        .error((e) => next(e));
}

export default { load, get, create, update, list, remove };
