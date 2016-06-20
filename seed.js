'use strict';

const mongoose = require('mongoose'),
    config = require('./config/config');

mongoose.connect(config.mongo);

mongoose.connection.on('error', (error) => {
    console.error('Unable to connect with database: ',error);
    throw new Error(error);
});
mongoose.connection.once('open', () => {
    console.log('Dropping database..');

    for(let collection in mongoose.connection.collections){
        if(typeof collection.drop == 'function') collection.drop();
    }

    console.log('Database dropped.');

    let collections = [
        {
            data: require('./seeds/organisations'),
            object: require('./server/models/organisation')
        },
        {
            data: require('./seeds/permissions.json'),
            object: require('./server/models/permission')
        },
        {
            data: require('./seeds/categories.json'),
            object: require('./server/models/category')
        },
        {
            data: require('./seeds/preferences.json'),
            object: require('./server/models/preference')
        },
        {
            data: require('./seeds/requests.json'),
            object: require('./server/models/request')
        },
        {
            data: require('./seeds/users.json'),
            object: require('./server/models/user')
        }
    ];

    for(let collection of collections){
        collection.data.forEach(object => (new collection.object(object)).save());
    }

    mongoose.connection.close();

});