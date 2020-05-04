import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { MenuPath, ProfilePath } from '../constants/Path';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';


export const RouteHandler: FC = () => (
  <>
    <Switch>
      <Route exact path={MenuPath.home} component={HomePage} />
      <Route exact path={ProfilePath.profile} component={ProfilePage} />
    </Switch>
  </>
);
