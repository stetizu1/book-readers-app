import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { DeleteForeverSharp, PersonPinSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookData } from 'book-app-shared/types/BookData';
import { Borrowed } from 'book-app-shared/types/Borrowed';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { BookLoansPath, MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from '../../blocks/card-layout/body/description/getDescription';
import { ConfirmationDialog } from '../../blocks/confirmation-dialog/ConfirmationDialog';
import { bookLoanAction } from '../../../modules/book-loan/bookLoanAction';
import { dialogAction } from '../../../modules/dialog/dialogAction';


interface StateProps {
  bookDataMap: IdMap<BookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  usersMap: IdMap<User> | undefined;
  bookLoans: Borrowed[] | undefined;
}

interface DispatchProps {
  deleteBookLoan: typeof bookLoanAction.startDeleteBookLoan;
  returnBorrowed: typeof bookLoanAction.startReturnBorrowed;
  setDialogState: typeof dialogAction.setState;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.bookLoan;

const BaseBookLoanPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const {
    bookLoans,
    authorsMap, booksMap, bookDataMap, usersMap,
    history,
    deleteBookLoan, returnBorrowed,
    setDialogState,
  } = props;

  if (isUndefined(bookDataMap)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(bookLoans) || isUndefined(usersMap)
  ) {
    return <UnknownError />;
  }

  const getNameOrEmail = (borrowed: Borrowed): string | null => {
    if (isNull(borrowed.userBorrowedId)) return null;
    const { name, email } = usersMap[borrowed.userBorrowedId];
    return isNull(name) ? email : name;
  };

  const getGridCardData = (borrowed: Borrowed): GridCardData => {
    const bookData = bookDataMap[borrowed.bookDataId];
    const {
      publisher, bookId,
    } = bookData;

    const authors = booksMap[bookId].authorIds.map((authorId) => authorsMap[authorId]);

    return {
      header: getCardHeader(booksMap[bookId].name, PersonPinSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: borrowed.comment }),
      ],

      topRightItems: [
        getItem({ value: getNameOrEmail(borrowed) }),
        getItem({ value: borrowed.nonUserName }),
      ],
      bottomRightItems: [
        getItem({ value: borrowed.until }),
      ],
      deleteButton:
        getButton({
          buttonType: ButtonType.dialogDelete,
          label: <DeleteForeverSharp />,
          onClick: (): void => {
            setDeleteId(borrowed.bookDataId);
            setDialogState(true);
          },
        }),
      buttons: [
        getButton({
          buttonType: ButtonType.edit,
          label: ButtonMessage.ReturnBook,
          onClick: (): void => {
            returnBorrowed(borrowed.id);
            history.push(MenuPath.bookLoans);
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            history.push(withParameterPath(BookLoansPath.bookLoansEdit, borrowed.id));
          },
        }),
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            history.push(withParameterPath(BookLoansPath.bookLoansDetail, borrowed.id));
          },
        }),
      ],
    };
  };
  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.Borrowed,
      onClick: (): void => {
        history.push(BookLoansPath.borrowed);
      },
    }),
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddLoan,
      onClick: (): void => {
        history.push(BookLoansPath.bookLoansAdd);
      },
    }),
  ];

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        if (!isUndefined(deleteId)) {
          deleteBookLoan(deleteId);
          setDialogState(false);
          history.push(MenuPath.bookLoans);
        }
      },
    }),
  };

  const getKey = (borrowed: Borrowed): string => String(borrowed.id);
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={bookLoans} getGridCardData={getGridCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const BookLoanPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
    bookLoans: bookLoanSelector.getAllActiveBookLoans(state),
  }), {
    returnBorrowed: bookLoanAction.startReturnBorrowed,
    deleteBookLoan: bookLoanAction.startDeleteBookLoan,
    setDialogState: dialogAction.setState,
  },
)(withRouter(withLoading(
  BaseBookLoanPage,
  librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllBookDataStatus,
  userSelector.getCurrentUserStatus,
  bookLoanSelector.getAllBookLoansStatus,
)));
