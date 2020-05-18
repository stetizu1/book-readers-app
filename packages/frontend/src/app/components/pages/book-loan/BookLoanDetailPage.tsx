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

import { BookLoanPath, MenuPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { IdMap } from 'app/types/IdMap';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';
import { bookLoanAction } from 'app/modules/book-loan/bookLoanAction';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  loansMap: IdMap<Borrowed> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  bookDataMap: IdMap<BookData> | undefined;
  usersMap: IdMap<User> | undefined;
}

interface DispatchProps {
  deleteBookLoan: typeof bookLoanAction.startDeleteBookLoan;
  returnBorrowed: typeof bookLoanAction.startReturnBorrowed;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;


const BaseBookLoanDetailPage: FC<Props> = (props) => {
  const { id: pathId } = useParams();

  const {
    loansMap,
    authorsMap, booksMap, genresMap, bookDataMap, usersMap,
    deleteBookLoan, setDialogState, returnBorrowed,
    history,
  } = props;
  if (isUndefined(loansMap) || isUndefined(bookDataMap) || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(usersMap)) {
    return null;
  }

  const loan = loansMap[pathId];
  const bookData = bookDataMap[loan.bookDataId];
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

  const bookDataSubHeaders = PageMessages.bookDetail.subHeaders.bookData;

  const getNameOrEmail = (borrowed: Borrowed): string | null => {
    if (isNull(borrowed.userBorrowedId)) return null;
    const { name, email } = usersMap[borrowed.userBorrowedId];
    return isNull(name) ? email : name;
  };

  const cardData: CardData = {
    header: getCardHeader(PageMessages.bookLoan.detailHeader, PersonPinSharp),
    items: [
      getSubHeader(bookDataSubHeaders.header),
      getItem({ label: bookDataSubHeaders.bookName, value: book.name }),
      getItems({ label: bookDataSubHeaders.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataSubHeaders.format, value: bookData.format }),
      getItem({ label: bookDataSubHeaders.publisher, value: bookData.publisher }),
      getItem({ label: bookDataSubHeaders.yearPublished, value: bookData.yearPublished }),
      getItem({ label: bookDataSubHeaders.isbn, value: bookData.isbn }),
      getItem({ label: bookDataSubHeaders.genre, value: genre?.name }),

      getSubHeader(PageMessages.bookLoan.loanSubHeader),
      getItem({
        label: PageMessages.bookLoan.subHeaders.borrowedTo,
        value: getNameOrEmail(loan),
      }),
      getItem({ label: PageMessages.bookLoan.subHeaders.nonUserName, value: loan.nonUserName }),
      getItem({ label: PageMessages.bookLoan.subHeaders.until, value: loan.until }),
      getItem({ label: PageMessages.bookLoan.subHeaders.comment, value: loan.comment }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ReturnBook,
        onClick: (): void => {
          returnBorrowed(loan.id);
          history.push(MenuPath.bookLoans);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          history.push(withParameterPath(BookLoanPath.edit, loan.id));
        },
      }),
    ],
  };

  const confirmationData = {
    header: getCardHeader(PageMessages.bookLoan.delete.header),
    description: getDescription(PageMessages.bookLoan.delete.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        deleteBookLoan(loan.id);
        setDialogState(false);
        history.push(MenuPath.bookLoans);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const BookLoanDetailPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    loansMap: bookLoanSelector.getAllActiveBookLoansMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
  }),
  {
    returnBorrowed: bookLoanAction.startReturnBorrowed,
    deleteBookLoan: bookLoanAction.startDeleteBookLoan,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseBookLoanDetailPage, userSelector.getCurrentUserStatus)));
