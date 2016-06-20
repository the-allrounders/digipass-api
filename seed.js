'use strict';

const mongoose = require('mongoose'),
    config = require('./config/config'),
    Organisation = require('./server/models/organisation'),
    Permission = require('./server/models/permission'), // status
    Category = require('./server/models/category'),
    Preference = require('./server/models/preference'),
    Request = require('./server/models/request'),
    User = require('./server/models/user');

mongoose.connect(config.mongo);

mongoose.connection.on('error', (error) => {
    console.error('Unable to connect with database: ',error);
    throw new Error(error);
});
mongoose.connection.once('open', () => {
    console.log('Connected with database');

    require('./seeds/organisations').forEach((organisation) => {
        (new Organisation(organisation)).save();
    });

    require('./seeds/status.json').forEach((organisation) => {
        (new Permission(organisation)).save();
    });

    require('./seeds/categories.json').forEach((organisation) => {
        (new Category(organisation)).save();
    });

    require('./seeds/preferences.json').forEach((organisation) => {
        (new Preference(organisation)).save();
    });

    require('./seeds/requests.json').forEach((organisation) => {
        (new Request(organisation)).save();
    });

    require('./seeds/users.json').forEach((organisation) => {
        (new User(organisation)).save();
    });

});