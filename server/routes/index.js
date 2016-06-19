const router = require('express').Router();

// Mount category routes at /categories
router.use('/categories', require('./category'));

// Mount preference routes at /preferences
router.use('/preferences', require('./preference'));

// Mount preference routes at /preferences
router.use('/organisations', require('./organisation'));

// Mount bluetooth routes at /bluetooth
router.use('/bluetooth', require('./bluetooth'));

// Mount user routes at /user
router.use('/users', require('./user'));

module.exports = router;