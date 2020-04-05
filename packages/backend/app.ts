/* eslint-disable import/first */
require('dotenv').config();

import {
  Application, NextFunction, Response, Request,
} from 'express';

import express = require('express');
import bodyParser = require('body-parser');

const port: string = process.env.PORT || '3000';
const app: Application = express();

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

app.listen(
  port,
  (): void => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`);
  },
);
