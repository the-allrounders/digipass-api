import express from 'express';
import categoryCtrl from '../controllers/category';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
/** GET /api/categories - Get list of categories */
    .get(categoryCtrl.list)

    /** POST /api/categories - Create new category */
    .post(categoryCtrl.create);

router.route('/:categoryId')
/** GET /api/categories/:categoryId - Get category */
    .get(categoryCtrl.get)

    /** PUT /api/categories/:categoryId - Update category */
    .put(categoryCtrl.update)

    /** DELETE /api/categories/:categoryId - Delete category */
    .delete(categoryCtrl.remove);

/** Load category when API with categoryId route parameter is hit */
router.param('categoryId', categoryCtrl.load);

export default router;
