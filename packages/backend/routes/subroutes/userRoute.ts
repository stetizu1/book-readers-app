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

  requests.get(
    app,
    Path.userData,
    userRepository.readUserById,
  );

  requests.getAll(
    app,
    Path.userData,
    userRepository.readAllUsers,
  );
};
