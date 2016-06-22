'use strict';

// Node-modules
const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport');

// Local files
const strategies = require('./strategies');

// Create server
const app = express();

// Initialize passport
passport.use(strategies.local);
passport.use(strategies.bearer);
app.use(passport.initialize());

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//statics for admin panel
app.use(express.static('../public'));
app.use('/dist', express.static('../node_modules/admin-lte/dist'));

// enable CORS - Cross Origin Resource Sharing
app.use(require('cors')());

// mount all routes on /api path
app.use('/api', require('./routes/index'));

module.exports = app;