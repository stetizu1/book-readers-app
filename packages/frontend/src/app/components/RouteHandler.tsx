import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { MenuPath, ProfilePath, UnauthorizedPath } from 'app/constants/Path';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { HomePage } from 'app/components/pages/HomePage';
import { ProfilePage } from 'app/components/pages/profile/ProfilePage';
import { EditProfilePage } from 'app/components/pages/profile/EditProfilePage';
import { LoginPage } from 'app/components/pages/login/LoginPage';


interface StateProps {
  isLoggedIn: boolean;
}

type Props = StateProps;

const BaseRouteHandler: FC<Props> = (props) => (
  <>
    {props.isLoggedIn ? (
      <Switch>
        <Route exact path={MenuPath.home} component={HomePage} />
        <Route exact path={ProfilePath.profile} component={ProfilePage} />
        <Route exact path={ProfilePath.edit} component={EditProfilePage} />
      </Switch>
    ) : (
      <Switch>
        <Route exact path={UnauthorizedPath.register} component={HomePage} />
        <Route component={LoginPage} />
      </Switch>
    )}
  </>
);

export const RouteHandler = connect(
  (state: AppState): StateProps => ({
    isLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRouteHandler);
