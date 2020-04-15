import { Application } from 'express';

import { friendship, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { FriendshipRepository } from '../../repositories/FriendshipRepository';


export const startFriendshipRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(friendship),
    wrapHandler.create(FriendshipRepository.createFriendship),
  );
};
