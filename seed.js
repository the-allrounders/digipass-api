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

        var objects = 0;
        var objectsDone = 0;
        for(let collection of collections){
            collection.data.forEach(object => {
                objects++;
                (new collection.object(object)).save().then(() => {
                    objectsDone++;
                }).catch(error => {console.log(error); objectsDone++;}).then(() => {
                    if(objectsDone == objects) mongoose.connection.close();
                });
            });
        }
    }, 3000);
});