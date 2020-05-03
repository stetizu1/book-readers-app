import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Path } from '../constants/Path';
import { HomePage } from './pages/HomePage';


export const RouteHandler: FC = () => (
  <>
    <Switch>
      <Route exact path={Path.home} component={HomePage} />
    </Switch>
  </>
);
