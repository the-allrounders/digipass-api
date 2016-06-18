const RequestCategory = require('../models/requestCategory'),
    mongoose = require('mongoose');

function create(req, res, next) {
    const
        requestCategoryId   = mongoose.Types.ObjectId(req.body.request),
        categoryId          = mongoose.Types.ObjectId(req.body.category),
        parentId            = req.body.parent;

    const requestCategory = new RequestCategory({
        request: requestCategoryId,
        category: categoryId,
        parent: parentId
    });

    console.log(requestCategory);

    requestCategory.saveAsync()
        .then((savedRequestCategory) => res.json(savedRequestCategory))
        .error((e) => next(e));
}

function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    RequestCategory.list({ limit, skip }).then((categories) =>	{
        console.log(categories);
        res.json(categories)
    })
        .error((e) => next(e));
}

module.exports = {create, list};
