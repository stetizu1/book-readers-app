import { LoginPath } from 'book-app-shared/paths/LoginPath';

import { unauthorizedRequests } from '../../helpers/express/expressCalls';
import { authRepository } from '../../repositories/AuthRepository';
import { Route } from '../../types/Route';


export const startLoginRoute: Route = (app) => {
  unauthorizedRequests.get(
    app,
    authRepository.handleLogin,
    LoginPath.get(),
  );
};
