import express from 'express';
import preferenceCtrl from '../controllers/preference';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
/** GET /api/preferences - Get list of preferences */
    .get(preferenceCtrl.list)

    /** POST /api/preferences - Create new preference */
    .post(preferenceCtrl.create);

router.route('/:preferenceId')
/** GET /api/preferences/:preferenceId - Get preference */
    .get(preferenceCtrl.get)

    /** PUT /api/preferences/:preferenceId - Update preference */
    .put(preferenceCtrl.update)

    /** DELETE /api/preferences/:preferenceId - Delete preference */
    .delete(preferenceCtrl.remove);

/** Load preference when API with preferenceId route parameter is hit */
router.param('preferenceId', preferenceCtrl.load);

export default router;
