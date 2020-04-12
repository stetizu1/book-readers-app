import { Application } from 'express';

import { startAuthorRoute } from './authorRoute';
import { startBookRoute } from './bookRoute';
import { startFriendshipRoute } from './friendshipRoute';
import { startLabelRoute } from './labelRoute';
import { startUserRoute } from './userRoute';


export const startRoutes = (app: Application): void => {
  startAuthorRoute(app);
  startBookRoute(app);
  startFriendshipRoute(app);
  startLabelRoute(app);
  startUserRoute(app);
};
