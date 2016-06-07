const categoryCtrl = require('../controllers/category');

const router = require('express').Router();

router.route('/')
    .get(categoryCtrl.list) /** GET /api/categories - Get list of categories */
    .post(categoryCtrl.create); /** POST /api/categories - Create new category */

router.route('/:categoryId')
    .get(categoryCtrl.get) /** GET /api/categories/:categoryId - Get category */
    .put(categoryCtrl.update) /** PUT /api/categories/:categoryId - Update category */
    .delete(categoryCtrl.remove); /** DELETE /api/categories/:categoryId - Delete category */

/** Load category when API with categoryId route parameter is hit */
router.param('categoryId', categoryCtrl.load);

module.exports = router;
