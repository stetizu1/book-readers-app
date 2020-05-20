import React, { FC } from 'react';
import { connect } from 'react-redux';
import { StarsSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { BookData } from 'book-app-shared/types/BookData';
import { Review } from 'book-app-shared/types/Review';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';


interface StateProps {
  reviews: Review[] | undefined;
  bookDataMap: IdMap<BookData> | undefined;

  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  usersMap: IdMap<User> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.reviews;

const BaseReviewsPage: FC<Props> = (props) => {
  const {
    history,
    reviews,
    bookDataMap,
    authorsMap, booksMap, usersMap,
  } = props;

  if (isUndefined(reviews) || isUndefined(booksMap) || isUndefined(authorsMap) || isUndefined(bookDataMap) || isUndefined(usersMap)) {
    return <UnknownError />;
  }

  const getGridCardData = (review: Review): GridCardData => {
    const bookData = bookDataMap[review.bookDataId];
    const book = booksMap[bookData.bookId];
    const authors = book.authorIds.map((authorId) => authorsMap[authorId]);

    const user = !isNull(bookData.userId) ? usersMap[bookData.userId] : null;
    const userNameOrEmail = isNull(user?.name) ? user?.email : user?.name;

    return {
      header: getCardHeader(book.name, StarsSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: bookData.publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: review.comment }),
      ],
      topRightItems: [
        getItem({ value: userNameOrEmail }),
      ],
      bottomRightItems: [
        getRating(review.stars),
      ],
    };
  };


  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.toFriendsReviews,
      onClick: (): void => {
        history.push(MenuPath.reviews);
      },
    }),
  ];

  const getKey = (review: Review): string => String(review.bookDataId);
  return (
    <>
      {getPageHeader(messages.pageHeaderOwn)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards
        data={reviews}
        getGridCardData={getGridCardData}
        getKey={getKey}
      />
    </>
  );
};

export const OwnReviewsPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    reviews: librarySelector.getAllReviews(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),

    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    usersMap: userSelector.getUsersMap(state),
  }),
  {},
)(withRouter(withLoading(
  BaseReviewsPage,
  librarySelector.getAllReviewsStatus,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  userSelector.getUsersStatus,
)));
