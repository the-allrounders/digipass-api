require('babel-register');

const mongoose = require('mongoose'),
    express = require('express'),
    config = require('./config/config'),
    promise = require('bluebird'),
    routes = require('./server/routes/index'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use('/api', routes);

// promisify mongoose
promise.promisifyAll(mongoose);

mongoose.connect(config.mongo);

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongo}`);
});

app.listen(config.port);

console.log('Server running');