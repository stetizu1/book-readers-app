import { Application } from 'express';

import { startAuthor } from './authorRoute';
import { startBook } from './bookRoute';


export const startRoutes = (app: Application): void => {
  startAuthor(app);
  startBook(app);
};
