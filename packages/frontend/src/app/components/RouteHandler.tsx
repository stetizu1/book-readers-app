import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from './HomePage';

export const RouteHandler: FC = () => (
  <>
    <Switch>
      <Route component={HomePage} />
    </Switch>
  </>
);
