'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    mongo: process.env.MONGODB_URI || 'mongodb://' + (process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost')
};