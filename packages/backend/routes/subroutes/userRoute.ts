import { Application } from 'express';

import { UserData } from 'book-app-shared/types/UserData';

import { userData, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { UserRepository } from '../../repositories/UserRepository';


export const startUserRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(userData),
    wrapHandler.create<UserData>(UserRepository.createUser),
  );
};
