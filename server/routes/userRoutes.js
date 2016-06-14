const userPreferenceCtrl = require('../controllers/userPreference'),
    requestCtrl = require('../controllers/request'),
    permissionCtrl = require('../controllers/permission');

const router = require('express').Router({mergeParams: true});

router.route('/preferences')
    .get(userPreferenceCtrl.list) /** GET /api/preferences - Get list of preferences */
    .post(userPreferenceCtrl.create); /** POST /api/preferences - Create new preference */

router.route('/preferences/:preferenceId')
    .delete(userPreferenceCtrl.remove); /** DELETE /api/preferences/:preferenceId - Delete preference */

router.route('/requests')
    .get(requestCtrl.list)
    .post(requestCtrl.create);

router.route('/permissions')
    .get(permissionCtrl.list)
    .post(permissionCtrl.create);

module.exports = router;