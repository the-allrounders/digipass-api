import express from 'express';
import userCtrl from '../controllers/user';
import userPreference from './userPreference';

const router = express.Router();

router.route('/')
/** GET /api/categories - Get list of categories */
    .get(userCtrl.list)

    /** POST /api/categories - Create new user */
    .post(userCtrl.create);

router.use('/:userId', userPreference);

export default router;
