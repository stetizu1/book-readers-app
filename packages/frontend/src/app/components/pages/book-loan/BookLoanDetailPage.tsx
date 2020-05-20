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

import { BookLoansPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';


interface StateProps {
  loansMap: IdMapOptional<Borrowed> | undefined;
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

const BaseBookLoanDetailPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    loansMap,
    authorsMap, booksMap, genresMap, bookDataMap, usersMap,
    history,
  } = props;
  if (isUndefined(loansMap) || isUndefined(bookDataMap) || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(usersMap)) {
    return <UnknownError />;
  }

  const loan = loansMap[pathId];
  if (isUndefined(loan)) {
    return <NotFoundError />;
  }

  const bookData = bookDataMap[loan.bookDataId];
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

  const getNameOrEmail = (borrowed: Borrowed): string | null => {
    if (isNull(borrowed.userBorrowedId)) return null;
    const { name, email } = usersMap[borrowed.userBorrowedId];
    return isNull(name) ? email : name;
  };

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
        label: messages.labels.borrowedTo,
        value: getNameOrEmail(loan),
      }),
      getItem({ label: messages.labels.nonUserName, value: loan.nonUserName }),
      getItem({ label: messages.labels.until, value: loan.until }),
      getItem({ label: messages.labels.comment, value: loan.comment }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.cancel,
        label: ButtonMessage.Back,
        onClick: (): void => {
          history.goBack();
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          history.push(withParameterPath(BookLoansPath.bookLoansEdit, loan.id));
        },
      }),
    ],
  };

  return (
    <Card data={cardData} />
  );
};

export const BookLoanDetailPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    loansMap: bookLoanSelector.getAllActiveBookLoansMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
  }),
)(withRouter(
  withLoading(
    BaseBookLoanDetailPage,
    bookLoanSelector.getAllBookLoansStatus,
    librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus, librarySelector.getAllBookDataStatus,
    userSelector.getUsersStatus,
  ),
));
