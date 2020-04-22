import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { friendshipRepository } from '../../repositories/FriendshipRepository';


export const startFriendshipRoute = (app: Express): void => {
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

  requests.put(
    app,
    Path.friendship,
    friendshipRepository.updateFriendship,
  );

  requests.delete(
    app,
    Path.friendship,
    friendshipRepository.deleteFriendship,
  );
};
