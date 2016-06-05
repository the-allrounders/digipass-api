import Category from '../models/category';

/**
 * Load category and append to req.
 */
function load(req, res, next, id) {
    Category.get(id).then((category) => {
        req.category = category;
        return next();
    }).error((e) => next(e));
}

/**
 * Get category
 * @returns {Category}
 */
function get(req, res) {
    return res.json(req.category);
}

/**
 * Create new category
 * @property {string} req.body.categoryname - The categoryname of category.
 * @property {string} req.body.mobileNumber - The mobileNumber of category.
 * @returns {Category}
 */
function create(req, res, next) {
    const category = new Category({
        title: req.body.title,
        description: req.body.description,
        parent: req.body.parent
    });

    category.saveAsync()
        .then((savedCategory) => res.json(savedCategory))
        .error((e) => next(e));
}

/**
 * Update existing category
 * @property {string} req.body.categoryname - The categoryname of category.
 * @property {string} req.body.mobileNumber - The mobileNumber of category.
 * @returns {Category}
 */
function update(req, res, next) {
    const category = req.category;
    category.title = req.body.title;
    category.description = req.body.description;
    category.parent = req.body.parent;

    category.saveAsync()
        .then((savedCategory) => res.json(savedCategory))
        .error((e) => next(e));
}

/**
 * Get category list.
 * @property {number} req.query.skip - Number of categories to be skipped.
 * @property {number} req.query.limit - Limit number of categorys to be returned.
 * @returns {Category[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Category.list({ limit, skip }).then((categories) =>	res.json(categories))
        .error((e) => next(e));
}

/**
 * Delete category.
 * @returns {Category}
 */
function remove(req, res, next) {
    const category = req.category;
    category.removeAsync()
        .then((deletedCategory) => res.json(deletedCategory))
        .error((e) => next(e));
}

export default { load, get, create, update, list, remove };
