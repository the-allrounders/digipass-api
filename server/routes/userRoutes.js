const userPreferenceCtrl = require('../controllers/userPreference'),
    requestCtrl = require('../controllers/request');

const router = require('express').Router({mergeParams: true});

router.route('/preferences')
    .get(userPreferenceCtrl.list) /** GET /api/preferences - Get list of preferences */
    .post(userPreferenceCtrl.create); /** POST /api/preferences - Create new preference */

router.route('/:preferenceId')
    .delete(userPreferenceCtrl.remove); /** DELETE /api/preferences/:preferenceId - Delete preference */

module.exports = router;
