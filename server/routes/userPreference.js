import express from 'express';
import userPreferenceCtrl from '../controllers/userPreference';

const router = express.Router({mergeParams: true});

router.route('/')
    /** GET /api/preferences - Get list of preferences */
    .get(userPreferenceCtrl.list)

    /** POST /api/preferences - Create new preference */
    .post(userPreferenceCtrl.create);

router.route('/:preferenceId')
    /** DELETE /api/preferences/:preferenceId - Delete preference */
    .delete(userPreferenceCtrl.remove);

export default router;
