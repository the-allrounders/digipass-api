const Request = require('../models/request'),
    mongoose = require('mongoose');

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
 * Create new request
 * @property {string} req.body.requestname - The requestname of request.
 * @property {string} req.body.mobileNumber - The mobileNumber of request.
 * @returns {Request}
 */
function create(req, res, next) {
    const organisationId = mongoose.Types.ObjectId(req.body.organisation);
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const permissions = [];
    req.body.permissions.forEach((v) => permissions.push(mongoose.Types.ObjectId(v)));

    const request = new Request({
        permissions: permissions,
        user: userId,
        organisation: organisationId,
        status: req.body.status
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
    const userId = mongoose.Types.ObjectId(req.params.userId);

    Request.list(userId).then((requests) =>	res.json(requests))
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

module.exports = { load, create, update, list, remove };
