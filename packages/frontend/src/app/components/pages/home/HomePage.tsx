import React, { FC } from 'react';

import { StopComponent } from './components/StopComponent';
import { LastAddedComponent } from './components/LastAddedComponent';
import { LastAddedWishComponent } from './components/LastAddedWishComponent';
import { SoonExpiringComponent } from './components/SoonExpiringComponent';


export const HomePage: FC = () => (
  <>
    <StopComponent />
    <LastAddedComponent />
    <LastAddedWishComponent />
    <SoonExpiringComponent />
  </>
);
