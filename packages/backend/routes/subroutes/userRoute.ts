import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { userRepository } from '../../repositories/UserRepository';


export const startUserRoute = (app: Application): void => {
  requests.post(
    app,
    Path.userData,
    userRepository.createUser,
  );
};
