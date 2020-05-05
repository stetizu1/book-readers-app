import React, { FC } from 'react';

import { Login } from 'app/components/pages/login/forms/Login';
import { GoogleRegister } from 'app/components/pages/login/forms/GoogleRegister';


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
