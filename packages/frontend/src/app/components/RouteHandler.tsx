import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
  LibraryPath, MenuPath, ProfilePath, UnauthorizedPath,
} from 'app/constants/Path';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { HomePage } from 'app/components/pages/HomePage';
import { LibraryPage } from 'app/components/pages/library/LibraryPage';
import { ProfilePage } from 'app/components/pages/profile/ProfilePage';
import { EditProfilePage } from 'app/components/pages/profile/EditProfilePage';

import { DetailPage } from 'app/components/pages/library/DetailPage';

import { RegisterPage } from 'app/components/pages/login/RegisterPage';
import { LoginPage } from 'app/components/pages/login/LoginPage';
import { parametrizedPathWithId } from 'app/helpers/path/parameters';


interface StateProps {
  isLoggedIn: boolean;
}

type Props = StateProps;

const BaseRouteHandler: FC<Props> = (props) => (
  <>
    {props.isLoggedIn ? (
      <Switch>
        <Route exact path={MenuPath.home} component={HomePage} />
        <Route exact path={MenuPath.library} component={LibraryPage} />

        <Route exact path={ProfilePath.profile} component={ProfilePage} />
        <Route exact path={ProfilePath.editProfile} component={EditProfilePage} />

        <Route exact path={parametrizedPathWithId(LibraryPath.editBookData)} component={HomePage} />
        <Route exact path={parametrizedPathWithId(LibraryPath.detailBookData)} component={DetailPage} />
      </Switch>
    ) : (
      <Switch>
        <Route exact path={UnauthorizedPath.register} component={RegisterPage} />
        <Route component={LoginPage} />
      </Switch>
    )}
  </>
);

export const RouteHandler = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    isLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRouteHandler);
