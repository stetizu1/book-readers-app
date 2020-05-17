import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  MenuPath,
  FriendPath, LibraryPath, ProfilePath, WishlistPath,
  UnauthorizedPath,
} from 'app/constants/Path';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { parametrizedPathWithId } from 'app/helpers/path/parameters';

import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/library/LibraryPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { RegisterPage } from './pages/login/RegisterPage';
import { LoginPage } from './pages/login/LoginPage';
import { LibraryEditPage } from './pages/library/LibraryEditPage';
import { LibraryDetailPage } from './pages/library/LibraryDetailPage';
import { LibraryAddPage } from './pages/library/LibraryAddPage';
import { LabelsPage } from './pages/library/labels/LabelPage';
import { LabelEditPage } from './pages/library/labels/LabelEditPage';
import { LabelAddPage } from './pages/library/labels/LabelAddPage';
import { FriendshipPage } from './pages/friendship/FriendshipPage';
import { FriendAddPage } from './pages/friendship/FriendAddPage';
import { WishlistPage } from './pages/wishlist/WishlistPage';
import { WishlistAddPage } from './pages/wishlist/WishlistAddPage';
import { WishlistDetailPage } from './pages/wishlist/WishlistDetailPage';
import { WishlistEditPage } from './pages/wishlist/WishlistEditPage';


interface StateProps {
  isLoggedIn: boolean;
}

type Props = StateProps;

const BaseRouteHandler: FC<Props> = (props) => (
  props.isLoggedIn ? (
    <Switch>
      <Route exact path={MenuPath.home} component={HomePage} />
      <Route exact path={MenuPath.library} component={LibraryPage} />
      <Route exact path={MenuPath.friends} component={FriendshipPage} />
      <Route exact path={MenuPath.wishlist} component={WishlistPage} />

      <Route exact path={ProfilePath.profile} component={ProfilePage} />
      <Route exact path={ProfilePath.profileEdit} component={EditProfilePage} />

      <Route exact path={parametrizedPathWithId(LibraryPath.bookDetail)} component={LibraryDetailPage} />
      <Route exact path={LibraryPath.bookAdd} component={LibraryAddPage} />
      <Route exact path={parametrizedPathWithId(LibraryPath.bookEdit)} component={LibraryEditPage} />

      <Route exact path={LibraryPath.labels} component={LabelsPage} />
      <Route exact path={LibraryPath.labelsAdd} component={LabelAddPage} />
      <Route exact path={parametrizedPathWithId(LibraryPath.labelsEdit)} component={LabelEditPage} />

      <Route exact path={FriendPath.friendAdd} component={FriendAddPage} />

      <Route exact path={WishlistPath.wishlistAdd} component={WishlistAddPage} />
      <Route exact path={parametrizedPathWithId(WishlistPath.wishlistDetail)} component={WishlistDetailPage} />
      <Route exact path={parametrizedPathWithId(WishlistPath.wishlistEdit)} component={WishlistEditPage} />
    </Switch>
  ) : (
    <Switch>
      <Route exact path={UnauthorizedPath.register} component={RegisterPage} />
      <Route component={LoginPage} />
    </Switch>
  )
);

export const RouteHandler = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    isLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRouteHandler);
