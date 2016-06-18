const Permission = require('../models/permission'),
    RequestCategory = require('../models/requestCategory'),
    mongoose = require('mongoose');

/**
 * Load permission and append to req.
 */
function load(req, res, next, id) {
    Permission.get(id).then((permission) => {
        req.permission = permission;
        return next();
    }).error((e) => next(e));
}

/**
 * Get permission
 * @returns {Permission}
 */
function get(req, res) {
    return res.json(req.permission);
}

/**
 * Create new permission
 * @property {string} req.body.permissionname - The permissionname of permission.
 * @property {string} req.body.mobileNumber - The mobileNumber of permission.
 * @returns {Permission}
 */
function create(req, res, next) {
    const permission = new Permission({
        preference: mongoose.Types.ObjectId(req.body.preference),
        request: mongoose.Types.ObjectId(req.body.request),
        user: mongoose.Types.ObjectId(req.params.userId),
        status: req.body.status
    });

    const categoryId = mongoose.Types.ObjectId(req.body.parent);
    const requestId = mongoose.Types.ObjectId(req.body.request);
    const promise = new Promise(
        (resolve, reject) => {
            RequestCategory.getByRequestId(requestId, categoryId)
                .then(requestCategory => {
                    if (requestCategory.length > 0) {
                        permission.parent = requestCategory[0].id;
                        resolve();
                    } else {
                        new RequestCategory({
                            request: requestId,
                            category: categoryId
                        }).saveAsync()
                            .then(savedRequestCategory => {
                                permission.parent = savedRequestCategory.id;
                                resolve();
                            });
                    }
                })
        }
    );

    promise.then(() => {
        permission.saveAsync()
            .then((savedPermission) => res.json(savedPermission))
            .error((e) => next(e));
    });
}

/**
 * Update existing permission
 * @property {string} req.body.permissionname - The permissionname of permission.
 * @property {string} req.body.mobileNumber - The mobileNumber of permission.
 * @returns {Permission}
 */
function update(req, res, next) {
    const permissionIds = req.body.permissions;
    const status = req.body.status;

    permissionIds.map(p => {
        const id = mongoose.Types.ObjectId(p);
        Permission.get(id)
            .then(permission => {
                permission.status = status;
                permission.saveAsync()
                    .then((savedPermission) => res.json(savedPermission))
                    .error((e) => next(e));
            });
    });
}

/**
 * Get permission list.
 * @property {number} req.query.skip - Number of permissions to be skipped.
 * @property {number} req.query.limit - Limit number of permissions to be returned.
 * @returns {Permission[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Permission.list({ limit, skip }).then((permissions) =>	res.json(permissions))
        .error((e) => next(e));
}

/**
 * Delete permission.
 * @returns {Permission}
 */
function remove(req, res, next) {
    const permission = req.permission;
    permission.removeAsync()
        .then((deletedPermission) => res.json(deletedPermission))
        .error((e) => next(e));
}

module.exports = { load, get, create, update, list, remove };
