/* eslint-disable import/first */
require('dotenv').config();

import { types } from 'pg';

import { Default } from './constants/Default';
import { startRoutes } from './routes/mainRoute';
/* eslint-enable import/first */

import express = require('express');
import bodyParser = require('body-parser');


const port = process.env.PORT || Default.port;
const app = express();

/* Set time stamp without time zone */
types.setTypeParser(1114, (stringValue) => `${stringValue}+0000`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Request-Headers');
    next();
  },
);

startRoutes(app);

app.listen(
  port,
  (): void => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`);
  },
);
