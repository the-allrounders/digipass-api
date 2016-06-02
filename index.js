import mongoose from 'mongoose';
import express from 'express';
import config from './config/config';
import promise from 'bluebird';
import routes from './server/routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';

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

mongoose.connect(config.db);

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

app.listen();