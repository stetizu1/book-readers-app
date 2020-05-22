import { UserPath } from 'book-app-shared/paths/UserPath';

import { Route } from '../../types/Route';
import { requests, unauthorizedRequests } from '../../helpers/express/expressCalls';
import { userRepository } from '../../repositories/UserRepository';


export const startUserRoute: Route = (app) => {
  unauthorizedRequests.post(
    app,
    userRepository.createUser,
    UserPath.post(),
  );

  unauthorizedRequests.get(
    app,
    userRepository.readUserByEmail,
    UserPath.getByEmail(),
  );

  requests.get(
    app,
    userRepository.readUserById,
    UserPath.get(),
  );

  requests.getAll(
    app,
    userRepository.readAllUsers,
    UserPath.getAll(),
  );

  requests.put(
    app,
    userRepository.updateUser,
    UserPath.put(),
  );

  requests.delete(
    app,
    userRepository.deleteUser,
    UserPath.delete(),
  );
};
