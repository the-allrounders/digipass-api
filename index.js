const express       = require('express'),
    bodyParser      = require('body-parser'),
    config          = require('./utils/config'),
    mongoose        = require('mongoose');

const preference = require('models/preferences.js'),
    categories = require('models/categories.js');

var app = express();

// Allow encoded POST-bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Allow JSON POST-bodies
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({message: "App is running"});
});

app.listen(config.port);

mongoose.connect('mongodb://localhost/test');