import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { friendshipRepository } from '../../repositories/FriendshipRepository';


export const startFriendshipRoute = (app: Application): void => {
  requests.post(
    app,
    Path.friendship,
    friendshipRepository.createFriendship,
  );

  requests.get(
    app,
    Path.friendship,
    friendshipRepository.readFriendshipById,
  );

  requests.getAll(
    app,
    Path.friendship,
    friendshipRepository.readAllFriendships,
  );
};
