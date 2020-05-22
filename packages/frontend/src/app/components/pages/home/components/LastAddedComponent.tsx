import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookData } from 'book-app-shared/types/BookData';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Review } from 'book-app-shared/types/Review';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { DoubleCard } from 'app/components/blocks/card-components/double-card/DoubleCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';


interface StateProps {
  bookData: BookData[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  reviewsMap: IdMapOptional<Review> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.home.lastAdded;

export const BaseLastAddedComponent: FC<Props> = (props) => {
  const {
    bookData, authorsMap, booksMap,
    reviewsMap,
    history,
  } = props;
  if (isUndefined(bookData) || isUndefined(booksMap) || isUndefined(authorsMap) || isUndefined(reviewsMap)) {
    return <UnknownError />;
  }

  const isLeft = bookData.length > 0;
  const isRight = bookData.length > 1;

  const getElements = (data: BookData): JSX.Element[] => {
    const authors = booksMap[data.bookId].authorIds.map((authorId) => authorsMap[authorId]);
    return [
      getSubHeader(booksMap[data.bookId].name),
      getItems({ values: authors, structureKey: 'name' }),
      getRating(reviewsMap[data.id]?.stars),
    ];
  };


  const leftItems = isLeft ? getElements(bookData[0]) : undefined;
  const rightItems = isRight ? getElements(bookData[1]) : undefined;

  return (
    <DoubleCard data={{
      header: getCardHeader(messages.header),
      itemsLeft: leftItems,
      itemsRight: rightItems,
      emptyMessage: messages.emptyMessage,
      button: getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ToLibrary,
        onClick: (): void => {
          history.push(MenuPath.library);
        },
      }),
    }}
    />
  );
};

export const LastAddedComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookData: librarySelector.getAllBookDataSorted(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    reviewsMap: librarySelector.getAllReviewsMap(state),
  }),
)(withRouter(withLoading(
  BaseLastAddedComponent,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllReviewsStatus,
)));
