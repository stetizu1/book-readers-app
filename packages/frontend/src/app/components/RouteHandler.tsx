import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { MenuPath, ProfilePath } from 'app/constants/Path';

import { HomePage } from 'app/components/pages/HomePage';
import { ProfilePage } from 'app/components/pages/profile/ProfilePage';
import { EditProfilePage } from 'app/components/pages/profile/EditProfilePage';


export const RouteHandler: FC = () => (
  <>
    <Switch>
      <Route exact path={MenuPath.home} component={HomePage} />
      <Route exact path={ProfilePath.profile} component={ProfilePage} />
      <Route exact path={ProfilePath.edit} component={EditProfilePage} />
    </Switch>
  </>
);
