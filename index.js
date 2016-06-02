const express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./utils/config');

var app = express();

// Allow encoded POST-bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Allow JSON POST-bodies
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({message: "App is running"});
});

app.listen(config.port);