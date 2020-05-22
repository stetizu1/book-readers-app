import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { PersonPinSharp } from '@material-ui/icons';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { Borrowed } from 'book-app-shared/types/Borrowed';
import { BookData } from 'book-app-shared/types/BookData';
import { User } from 'book-app-shared/types/User';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { AppState } from 'app/types/AppState';

import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';
import { friendsDataSelector } from 'app/modules/friends-data/friendshipSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';


interface StateProps {
  borrowedMap: IdMapOptional<Borrowed> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  bookDataMap: IdMap<BookData> | undefined;
  usersMap: IdMap<User> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.bookLoan;
const libraryMessages = PageMessages.library;
const [bookDataSubHeader, bookDataLabels] = [libraryMessages.subHeaders.bookData, libraryMessages.labels.bookData];

const BaseBorrowedDetailPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    borrowedMap,
    authorsMap, booksMap, genresMap, bookDataMap, usersMap,
    history,
  } = props;
  if (isUndefined(borrowedMap) || isUndefined(bookDataMap) || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(usersMap)) {
    return <UnknownError />;
  }

  const currentBorrowed = borrowedMap[pathId];
  if (isUndefined(currentBorrowed)) {
    return <NotFoundError />;
  }

  const bookData = bookDataMap[currentBorrowed.bookDataId];
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;
  const { userId } = bookData;

  const cardData: CardData = {
    header: getCardHeader(messages.detailHeader, PersonPinSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getItem({ label: bookDataLabels.bookName, value: book.name }),
      getItems({ label: bookDataLabels.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataLabels.format, value: bookData.format }),
      getItem({ label: bookDataLabels.publisher, value: bookData.publisher }),
      getItem({ label: bookDataLabels.yearPublished, value: bookData.yearPublished }),
      getItem({ label: bookDataLabels.isbn, value: bookData.isbn }),
      getItem({ label: bookDataLabels.genre, value: genre?.name }),

      getSubHeader(messages.subHeader),
      getItem({
        label: messages.labels.borrowedFrom,
        value: isNull(userId) ? null : usersMap[userId].email,
      }),
      getItem({
        value: isNull(userId) ? null : usersMap[userId].name,
      }),
      getItem({ label: messages.labels.nonUserName, value: currentBorrowed.nonUserName }),
      getItem({ label: messages.labels.until, value: currentBorrowed.until }),
      getItem({ label: messages.labels.comment, value: currentBorrowed.comment }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.cancel,
        label: ButtonMessage.Back,
        onClick: () => history.goBack(),
      }),
    ],
  };

  return (
    <Card data={cardData} />
  );
};

export const BorrowedDetailPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    borrowedMap: bookLoanSelector.getAllActiveBorrowedMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    bookDataMap: friendsDataSelector.getAllFriendsDataBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
  }),
)(withRouter(
  withLoading(
    BaseBorrowedDetailPage,
    bookLoanSelector.getAllBookLoansStatus,
    librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus,
    friendsDataSelector.getAllFriendsDataBookDataStatus,
    userSelector.getUsersStatus,
  ),
));
