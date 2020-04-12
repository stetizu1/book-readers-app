import { Application } from 'express';

import { startAuthor } from './authorRoute';
import { startBook } from './bookRoute';
import { startFriendship } from './friendshipRoute';
import { startUser } from './userRoute';


export const startRoutes = (app: Application): void => {
  startAuthor(app);
  startBook(app);
  startFriendship(app);
  startUser(app);
};
