import { Express } from 'express';

import { Path } from '../../constants/Path';
import { unauthorizedRequests } from '../../helpers/express/expressCalls';
import { loginRepository } from '../../repositories/LoginRepository';


export const startLoginRoute = (app: Express): void => {
  unauthorizedRequests.get(
    app,
    Path.login,
    loginRepository.handleLogin,
  );
};
