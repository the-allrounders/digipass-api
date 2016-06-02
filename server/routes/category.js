import express from 'express';
import validate from 'express-validation';
import categoryCtrl from '../controllers/category';
import paramValidation from '../../config/param-validation';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
/** GET /api/categories - Get list of categories */
    .get(categoryCtrl.list)

    /** POST /api/categories - Create new category */
    .post(validate(paramValidation.createUser), categoryCtrl.create);

router.route('/:categoryId')
/** GET /api/categories/:categoryId - Get category */
    .get(categoryCtrl.get)

    /** PUT /api/categories/:categoryId - Update category */
    .put(validate(paramValidation.updateUser), categoryCtrl.update)

    /** DELETE /api/categories/:categoryId - Delete category */
    .delete(categoryCtrl.remove);

/** Load category when API with categoryId route parameter is hit */
router.param('categoryId', categoryCtrl.load);

export default router;
