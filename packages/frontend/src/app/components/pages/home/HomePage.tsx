import React, { FC } from 'react';

import { StopComponent } from './components/StopComponent';
import { LastAddedComponent } from './components/LastAddedComponent';


export const HomePage: FC = () => (
  <>
    <StopComponent />
    <LastAddedComponent />
  </>
);
