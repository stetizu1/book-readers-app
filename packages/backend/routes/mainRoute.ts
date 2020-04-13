import { Application } from 'express';

import { startAuthorRoute } from './subroutes/authorRoute';
import { startBookRoute } from './subroutes/bookRoute';
import { startBookDataRoute } from './subroutes/bookDataRoute';
import { startFriendshipRoute } from './subroutes/friendshipRoute';
import { startLabelRoute } from './subroutes/labelRoute';
import { startUserRoute } from './subroutes/userRoute';


export const startRoutes = (app: Application): void => {
  startAuthorRoute(app);
  startBookRoute(app);
  startBookDataRoute(app);
  startFriendshipRoute(app);
  startLabelRoute(app);
  startUserRoute(app);
};
