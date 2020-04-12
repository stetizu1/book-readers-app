import { Application } from 'express';

import { Friendship } from 'book-app-shared/types/Friendship';

import { friendship, path } from '../constants/paths';
import { ActionType } from '../constants/actionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { executeWithContext } from '../storage_context/executeWithContext';
import { FriendshipRepository } from '../repositories/FriendshipRepository';


export const startFriendship = (app: Application): void => {
  requests.post(
    app,
    path.post(friendship),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Friendship>(FriendshipRepository.createFriendship),
    }),
  );
};
