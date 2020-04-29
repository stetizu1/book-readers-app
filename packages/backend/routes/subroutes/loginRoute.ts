import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { unauthorizedRequests } from '../../helpers/express/expressCalls';
import { authRepository } from '../../repositories/AuthRepository';


export const startLoginRoute = (app: Express): void => {
  unauthorizedRequests.get(
    app,
    authRepository.handleLogin,
    Path.login,
  );
};
