const router = require('express').Router();

router.use('/session', require('./session'));

// Mount category routes at /categories
router.use('/categories', require('./category'));

// Mount preference routes at /preferences
router.use('/preferences', require('./preference'));

// Mount user routes at /user
router.use('/users', require('./user'));

module.exports = router;