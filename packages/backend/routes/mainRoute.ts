import { Express } from 'express';

import { startAuthorRoute } from './subroutes/authorRoute';
import { startBookRoute } from './subroutes/bookRoute';
import { startBookDataRoute } from './subroutes/bookDataRoute';
import { startBookRequestRoute } from './subroutes/bookRequestRoute';
import { startBorrowedRoute } from './subroutes/borrowedRoute';
import { startFriendshipRoute } from './subroutes/friendshipRoute';
import { startGenreRoute } from './subroutes/genreRoute';
import { startHasLabelRoute } from './subroutes/hasLabelRoute';
import { startLabelRoute } from './subroutes/labelRoute';
import { startLoginRoute } from './subroutes/loginRoute';
import { startPersonalBookDataRoute } from './subroutes/personalBookDataRoute';
import { startReviewRoute } from './subroutes/reviewRoute';
import { startUserRoute } from './subroutes/userRoute';


export const startRoutes = (app: Express): void => {
  startAuthorRoute(app);
  startBookRoute(app);
  startBookDataRoute(app);
  startBookRequestRoute(app);
  startBorrowedRoute(app);
  startFriendshipRoute(app);
  startGenreRoute(app);
  startHasLabelRoute(app);
  startLabelRoute(app);
  startLoginRoute(app);
  startPersonalBookDataRoute(app);
  startReviewRoute(app);
  startUserRoute(app);
};
