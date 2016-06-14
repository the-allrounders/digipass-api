const Organisation = require('../models/organisation');

/**
 * Load organisation and append to req.
 */
function load(req, res, next, id) {
    Organisation.get(id).then((organisation) => {
        req.organisation = organisation;
        return next();
    }).error((e) => next(e));
}

/**
 * Get organisation
 * @returns {Organisation}
 */
function get(req, res) {
    return res.json(req.organisation);
}

/**
 * Create new organisation
 * @property {string} req.body.organisationname - The organisationname of organisation.
 * @property {string} req.body.mobileNumber - The mobileNumber of organisation.
 * @returns {Organisation}
 */
function create(req, res, next) {
    const organisation = new Organisation({
        title: req.body.title,
        icon: req.body.icon
    });

    organisation.saveAsync()
        .then((savedOrganisation) => res.json(savedOrganisation))
        .error((e) => next(e));
}

/**
 * Update existing organisation
 * @property {string} req.body.organisationname - The organisationname of organisation.
 * @property {string} req.body.mobileNumber - The mobileNumber of organisation.
 * @returns {Organisation}
 */
function update(req, res, next) {
    const organisation = req.organisation;
    organisation.title = req.body.title;
    organisation.icon = req.body.icon;

    organisation.saveAsync()
        .then((savedOrganisation) => res.json(savedOrganisation))
        .error((e) => next(e));
}

/**
 * Get organisation list.
 * @property {number} req.query.skip - Number of organisations to be skipped.
 * @property {number} req.query.limit - Limit number of organisations to be returned.
 * @returns {Organisation[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Organisation.list({ limit, skip }).then((organisations) =>	res.json(organisations))
        .error((e) => next(e));
}

/**
 * Delete organisation.
 * @returns {Organisation}
 */
function remove(req, res, next) {
    const organisation = req.organisation;
    organisation.removeAsync()
        .then((deletedOrganisation) => res.json(deletedOrganisation))
        .error((e) => next(e));
}

module.exports = { load, get, create, update, list, remove };
