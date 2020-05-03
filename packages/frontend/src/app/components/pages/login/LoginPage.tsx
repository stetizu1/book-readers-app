import React, { FC } from 'react';
import { Login } from './forms/Login';
import { GoogleRegister } from './forms/GoogleRegister';

export const LoginPage: FC = () => (
  <>
    <div>
      <Login />
    </div>
    <div>
      <GoogleRegister />
    </div>
  </>
);
