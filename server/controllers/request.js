const Request = require('../models/request');

/**
 * Load request and append to req.
 */
function load(req, res, next, id) {
    Request.get(id).then((request) => {
        req.request = request;
        return next();
    }).error((e) => next(e));
}

/**
 * Get request
 * @returns {Request}
 */
function get(req, res) {
    return res.json(req.request);
}

/**
 * Create new request
 * @property {string} req.body.requestname - The requestname of request.
 * @property {string} req.body.mobileNumber - The mobileNumber of request.
 * @returns {Request}
 */
function create(req, res, next) {
    const request = new Request({
        title: req.body.title,
        description: req.body.description,
        parent: req.body.parent,
        icon: req.body.icon
    });

    request.saveAsync()
        .then((savedRequest) => res.json(savedRequest))
        .error((e) => next(e));
}

/**
 * Update existing request
 * @property {string} req.body.requestname - The requestname of request.
 * @property {string} req.body.mobileNumber - The mobileNumber of request.
 * @returns {Request}
 */
function update(req, res, next) {
    const request = req.request;
    request.title = req.body.title;
    request.description = req.body.description;
    request.parent = req.body.parent;
    request.icon = req.body.icon;

    request.saveAsync()
        .then((savedRequest) => res.json(savedRequest))
        .error((e) => next(e));
}

/**
 * Get request list.
 * @property {number} req.query.skip - Number of requests to be skipped.
 * @property {number} req.query.limit - Limit number of requests to be returned.
 * @returns {Request[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Request.list({ limit, skip }).then((requests) =>	res.json(requests))
        .error((e) => next(e));
}

/**
 * Delete request.
 * @returns {Request}
 */
function remove(req, res, next) {
    const request = req.request;
    request.removeAsync()
        .then((deletedRequest) => res.json(deletedRequest))
        .error((e) => next(e));
}

module.exports = { load, get, create, update, list, remove };
