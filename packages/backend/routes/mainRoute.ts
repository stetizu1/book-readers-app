import { Application } from 'express';

import { startAuthor } from './authorRoute';
import { startBook } from './bookRoute';
import { startUser } from './userRoute';


export const startRoutes = (app: Application): void => {
  startAuthor(app);
  startBook(app);
  startUser(app);
};
