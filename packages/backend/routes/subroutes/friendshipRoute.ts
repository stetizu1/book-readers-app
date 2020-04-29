import { FriendshipPath } from 'book-app-shared/paths/FriendshipPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { friendshipRepository } from '../../repositories/FriendshipRepository';


export const startFriendshipRoute: Route = (app) => {
  requests.post(
    app,
    friendshipRepository.createFriendship,
    FriendshipPath.post(),
  );

  requests.get(
    app,
    friendshipRepository.readFriendshipById,
    FriendshipPath.get(),
  );

  requests.getAll(
    app,
    friendshipRepository.readAllFriendships,
    FriendshipPath.getAll(),
  );

  requests.put(
    app,
    friendshipRepository.updateFriendship,
    FriendshipPath.put(),
  );

  requests.delete(
    app,
    friendshipRepository.deleteFriendship,
    FriendshipPath.delete(),
  );
};
