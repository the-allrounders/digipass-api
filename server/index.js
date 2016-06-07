const express = require('express'),
    bodyParser = require('body-parser');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(require('cors')());

// mount all routes on /api path
app.use('/api', require('./routes/index'));

module.exports = app;