import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  MenuPath,
  FriendsPath, LibraryPath, ProfilePath, WishlistPath,
  UnauthorizedPath, BookLoansPath, ReviewsPath,
} from 'app/constants/Path';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { parametrizedPathWithId } from 'app/helpers/path/parameters';

import { HomePage } from './pages/HomePage';

import { LibraryPage } from './pages/library/LibraryPage';
import { LibraryAddPage } from './pages/library/LibraryAddPage';
import { LibraryEditPage } from './pages/library/LibraryEditPage';
import { LibraryDetailPage } from './pages/library/LibraryDetailPage';

import { LabelsPage } from './pages/library/labels/LabelPage';
import { LabelAddPage } from './pages/library/labels/LabelAddPage';
import { LabelEditPage } from './pages/library/labels/LabelEditPage';

import { ReviewsPage } from './pages/reviews/ReviewsPage';
import { OwnReviewsPage } from './pages/reviews/OwnReviewsPage';

import { FriendshipPage } from './pages/friendship/FriendshipPage';
import { FriendAddPage } from './pages/friendship/FriendAddPage';

import { WishlistPage } from './pages/wishlist/WishlistPage';
import { BookedBookRequests } from './pages/wishlist/BookedBookRequestsPage';
import { WishlistAddPage } from './pages/wishlist/WishlistAddPage';
import { WishlistDetailPage } from './pages/wishlist/WishlistDetailPage';
import { WishlistEditPage } from './pages/wishlist/WishlistEditPage';

import { BookLoanPage } from './pages/book-loan/BookLoanPage';
import { BorrowedPage } from './pages/book-loan/BorrowedPage';
import { BorrowedDetailPage } from './pages/book-loan/BorrowedDetailPage';
import { BookLoanAddPage } from './pages/book-loan/BookLoanAddPage';
import { BookLoanEditPage } from './pages/book-loan/BookLoanEditPage';
import { BookLoanDetailPage } from './pages/book-loan/BookLoanDetailPage';

import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';

import { RegisterPage } from './pages/login/RegisterPage';
import { LoginPage } from './pages/login/LoginPage';
import { FriendsWishlistPage } from './pages/wishlist/FriendsWishlistPage';


interface StateProps {
  isLoggedIn: boolean;
}

type Props = StateProps;

const BaseRouteHandler: FC<Props> = (props) => (
  props.isLoggedIn ? (
    <Switch>
      <Route exact path={MenuPath.home} component={HomePage} />


      <Route exact path={MenuPath.library} component={LibraryPage} />
      <Route exact path={LibraryPath.bookAdd} component={LibraryAddPage} />
      <Route exact path={parametrizedPathWithId(LibraryPath.bookEdit)} component={LibraryEditPage} />
      <Route exact path={parametrizedPathWithId(LibraryPath.bookDetail)} component={LibraryDetailPage} />

      <Route exact path={LibraryPath.labels} component={LabelsPage} />
      <Route exact path={LibraryPath.labelsAdd} component={LabelAddPage} />
      <Route exact path={parametrizedPathWithId(LibraryPath.labelsEdit)} component={LabelEditPage} />


      <Route exact path={MenuPath.reviews} component={ReviewsPage} />
      <Route exact path={ReviewsPath.toOwnReviews} component={OwnReviewsPage} />


      <Route exact path={MenuPath.friends} component={FriendshipPage} />
      <Route exact path={FriendsPath.friendAdd} component={FriendAddPage} />


      <Route exact path={MenuPath.wishlist} component={WishlistPage} />
      <Route exact path={WishlistPath.bookedBookRequests} component={BookedBookRequests} />
      <Route exact path={WishlistPath.wishlistAdd} component={WishlistAddPage} />
      <Route exact path={parametrizedPathWithId(WishlistPath.wishlistEdit)} component={WishlistEditPage} />
      <Route exact path={parametrizedPathWithId(WishlistPath.wishlistDetail)} component={WishlistDetailPage} />
      <Route exact path={parametrizedPathWithId(WishlistPath.wishlistFriends)} component={FriendsWishlistPage} />

      <Route exact path={MenuPath.bookLoans} component={BookLoanPage} />
      <Route exact path={BookLoansPath.borrowed} component={BorrowedPage} />
      <Route exact path={parametrizedPathWithId(BookLoansPath.borrowedDetail)} component={BorrowedDetailPage} />
      <Route exact path={BookLoansPath.bookLoansAdd} component={BookLoanAddPage} />
      <Route exact path={parametrizedPathWithId(BookLoansPath.bookLoansEdit)} component={BookLoanEditPage} />
      <Route exact path={parametrizedPathWithId(BookLoansPath.bookLoansDetail)} component={BookLoanDetailPage} />


      <Route exact path={ProfilePath.profile} component={ProfilePage} />
      <Route exact path={ProfilePath.profileEdit} component={EditProfilePage} />
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
