const userCtrl = require('../controllers/user');

const router = require('express').Router();

router.route('/')
    .get(userCtrl.list) /** GET /api/categories - Get list of categories */
    .post(userCtrl.create); /** POST /api/categories - Create new user */

router.use('/:userId', require('./userRoutes'));

module.exports = router;
