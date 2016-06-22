'use strict';

console.log('Starting app..');

const promise = require('bluebird'),
    config = require('./config/config'),
    mongoose = promise.promisifyAll(require('mongoose')),
    express = require('express');

const app = require('./server');

console.log('Connecting with database..', config.mongo);
mongoose.connect(config.mongo);

mongoose.connection.on('error', (error) => {
    console.error('Unable to connect with database: ',error);
    throw new Error(error);
});

mongoose.connection.once('open', () => {
    console.log('Connected with database');

    //statics for admin panel
    app.use(express.static(__dirname+'/public'));
    app.use('/dist', express.static(__dirname+'/node_modules/admin-lte/dist'));
    app.use('/adminlte', express.static(__dirname+'/node_modules/admin-lte'));

    app.listen(config.port);
    console.log('Server running on port', config.port);
});