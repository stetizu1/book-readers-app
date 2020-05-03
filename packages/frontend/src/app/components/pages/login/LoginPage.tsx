import React, { FC } from 'react';
import { Login } from './forms/Login';
import { RegisterGoogle } from './forms/RegisterGoogle';

export const LoginPage: FC = () => (
  <>
    <div>
      <Login />
    </div>
    <div>
      <RegisterGoogle />
    </div>
  </>
);
