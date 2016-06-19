'use strict';

const router = require('express').Router(),
    Organisations = require('../models/organisation');

router.route('/').post((req, res) => {
    Organisations.find({'devices.bluetooth': req.body.bluetooth}).then((results) => {
        res.json(results);
    });
});

module.exports = router;