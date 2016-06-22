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

    let collections = [
        {
            data: require('./seeds/organisations'),
            object: require('./server/models/organisation')
        },
        {
            data: require('./seeds/categories'),
            object: require('./server/models/category')
        },
        {
            data: require('./seeds/preferences'),
            object: require('./server/models/preference')
        }
    ];

    for(let collection of collections) {
        collection.object.remove({}, function (err) {
            console.log('collection removed');
        });
    }

    setTimeout(() => {
        console.log('Database dropped.');



        for(let collection of collections){
            //console.log('collection: ',collection);
            collection.data.forEach(object => {
                (new collection.object(object)).save().then(() => { console.log('Inserted', object); }).catch(console.log);
            });
        }
    }, 3000);


    setTimeout(() => mongoose.connection.close(), 6000);
});