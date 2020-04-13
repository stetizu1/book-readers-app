import { Application } from 'express';

import { startAuthorRoute } from './subroutes/authorRoute';
import { startBookRoute } from './subroutes/bookRoute';
import { startBookDataRoute } from './subroutes/bookDataRoute';
import { startFriendshipRoute } from './subroutes/friendshipRoute';
import { startHasLabelRoute } from './subroutes/hasLabelRoute';
import { startLabelRoute } from './subroutes/labelRoute';
import { startPersonalBookDataRoute } from './subroutes/personalBookDataRoute';
import { startReviewRoute } from './subroutes/reviewRoute';
import { startUserRoute } from './subroutes/userRoute';


export const startRoutes = (app: Application): void => {
  startAuthorRoute(app);
  startBookRoute(app);
  startBookDataRoute(app);
  startFriendshipRoute(app);
  startHasLabelRoute(app);
  startLabelRoute(app);
  startPersonalBookDataRoute(app);
  startReviewRoute(app);
  startUserRoute(app);
};
