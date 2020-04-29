import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { friendshipRepository } from '../../repositories/FriendshipRepository';


export const startFriendshipRoute = (app: Express): void => {
  requests.post(
    app,
    friendshipRepository.createFriendship,
    Path.friendship,
  );

  requests.get(
    app,
    friendshipRepository.readFriendshipById,
    Path.friendship,
  );

  requests.getAll(
    app,
    friendshipRepository.readAllFriendships,
    Path.friendship,
  );

  requests.put(
    app,
    friendshipRepository.updateFriendship,
    Path.friendship,
  );

  requests.delete(
    app,
    friendshipRepository.deleteFriendship,
    Path.friendship,
  );
};
