/* eslint-disable import/first */
import { types } from 'pg';

require('dotenv').config();

import {
  Application, NextFunction, Request, Response,
} from 'express';

import { DEFAULT_PORT } from './constants/defaults';
import { startRoutes } from './routes/mainRoute';


import express = require('express');
import bodyParser = require('body-parser');


const port = process.env.PORT || DEFAULT_PORT;
const app: Application = express();

/* Set timestamp without timezone */
types.setTypeParser(1114, (stringValue) => `${stringValue}+0000`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  (request: Request, response: Response, next: NextFunction): void => {
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
