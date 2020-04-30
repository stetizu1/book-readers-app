import { LoginPath } from 'book-app-shared/paths/LoginPath';

import { unauthorizedRequests } from '../../helpers/express/expressCalls';
import { loginRepository } from '../../repositories/LoginRepository';
import { Route } from '../../types/Route';


export const startLoginRoute: Route = (app) => {
  unauthorizedRequests.get(
    app,
    loginRepository.handleLogin,
    LoginPath.get(),
  );
};
