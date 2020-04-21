import { Application } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { userRepository } from '../../repositories/UserRepository';


export const startUserRoute = (app: Application): void => {
  requests.post(
    app,
    Path.user,
    userRepository.createUser,
  );

  requests.get(
    app,
    Path.user,
    userRepository.readUserById,
  );

  requests.getAll(
    app,
    Path.user,
    userRepository.readAllUsers,
  );

  requests.put(
    app,
    Path.user,
    userRepository.updateUser,
  );

  requests.delete(
    app,
    Path.user,
    userRepository.deleteUser,
  );
};
