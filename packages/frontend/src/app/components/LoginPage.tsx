import React, { FC } from 'react';
import { Login } from './Login';
import { RegisterForm } from './RegisterForm';

export const LoginPage: FC = () => (
  <>
    <div>
      <Login />
    </div>
    <div>
      <RegisterForm />
    </div>
  </>
);
