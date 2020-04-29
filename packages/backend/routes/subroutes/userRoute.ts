import { Express } from 'express';

import { Path, PathSpecification } from 'book-app-shared/constants/Path';

import { requests, unauthorizedRequests } from '../../helpers/express/expressCalls';
import { userRepository } from '../../repositories/UserRepository';


export const startUserRoute = (app: Express): void => {
  unauthorizedRequests.post(
    app,
    userRepository.createUser,
    Path.user,
  );

  requests.get(
    app,
    userRepository.readUserById,
    Path.user,
  );

  requests.getAll(
    app,
    userRepository.readAllUsers,
    Path.user,
  );

  requests.put(
    app,
    userRepository.updateUser,
    Path.user,
  );

  requests.delete(
    app,
    userRepository.deleteUser,
    Path.user,
  );

  requests.get(
    app,
    userRepository.readUserByEmail,
    Path.user,
    PathSpecification.email,
  );
};
