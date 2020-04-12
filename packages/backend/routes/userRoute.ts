import { Application } from 'express';

import { UserData } from 'book-app-shared/types/UserData';

import { userData, path } from '../constants/paths';
import { ActionType } from '../constants/actionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { executeWithContext } from '../storage_context/executeWithContext';
import { UserRepository } from '../repositories/UserRepository';


export const startUser = (app: Application): void => {
  requests.post(
    app,
    path.post(userData),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<UserData>(UserRepository.createUser),
    }),
  );
};
