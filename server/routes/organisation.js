const organisationCtrl = require('../controllers/organisation');

const router = require('express').Router();

router.route('/')
    .get(organisationCtrl.list) /** GET /api/organisations - Get list of organisations */
    .post(organisationCtrl.create); /** POST /api/organisations - Create new organisation */

router.route('/:organisationId')
    .get(organisationCtrl.get) /** GET /api/organisations/:organisationId - Get organisation */
    .put(organisationCtrl.update) /** PUT /api/organisations/:organisationId - Update organisation */
    .delete(organisationCtrl.remove); /** DELETE /api/organisations/:organisationId - Delete organisation */

/** Load organisation when API with organisationId route parameter is hit */
router.param('organisationId', organisationCtrl.load);

module.exports = router;
