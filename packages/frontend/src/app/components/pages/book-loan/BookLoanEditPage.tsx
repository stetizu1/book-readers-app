import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Borrowed, BorrowedUpdate } from 'book-app-shared/types/Borrowed';
import { User } from 'book-app-shared/types/User';
import { BookData } from 'book-app-shared/types/BookData';
import { Book } from 'book-app-shared/types/Book';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertBorrowedToBorrowedUpdate } from 'book-app-shared/helpers/convert-to-update/borrowed';
import { isEmptyObject } from 'book-app-shared/helpers/validators';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { bookLoanAction } from 'app/modules/book-loan/bookLoanAction';
import { userSelector } from 'app/modules/user/userSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getNumberSelectNullableFormItem } from '../../blocks/card-items/items-form/select/number-nullable/getNumberSelectNullableFormItem';


interface StateProps {
  bookDataMap: IdMap<BookData> | undefined;
  bookLoanMap: IdMap<Borrowed> | undefined;
  usersMap: IdMap<User> | undefined;
  booksMap: IdMap<Book> | undefined;
  friends: User[] | undefined;
}

interface DispatchProps {
  startUpdateBorrowed: typeof bookLoanAction.startUpdateBookLoan;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.bookLoan;

const BaseBookLoanEditPage: FC<Props> = (props) => {
  const {
    bookLoanMap, usersMap, booksMap,
    bookDataMap, friends,
    startUpdateBorrowed,
    history,
  } = props;
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const [bookLoanUpdate, setBookLoanUpdate] = useState<BorrowedUpdate>({});

  if (isUndefined(bookLoanMap) || isUndefined(friends) || isUndefined(bookDataMap) || isUndefined(usersMap) || isUndefined(booksMap)) {
    return null;
  }

  const loan = bookLoanMap[pathId];
  const loanedBookData = bookDataMap[loan.bookDataId];

  if (isEmptyObject(bookLoanUpdate)) {
    const defaultState = convertBorrowedToBorrowedUpdate(loan);
    setBookLoanUpdate(defaultState);
  }

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, StarsSharp),
    items: [
      getTextFormItem({
        label: messages.labels.book,
        value: booksMap[loanedBookData.bookId].name,
        readOnly: true,
      }),
      getNumberSelectNullableFormItem({
        label: messages.labels.borrowedTo,
        value: bookLoanUpdate.userBorrowedId,
        options: friends.map((user) => ({ name: isNull(user.name) ? user.email : user.name, value: user.id })),
        updateValueFunction: getUpdateValue(bookLoanUpdate, setBookLoanUpdate, 'userBorrowedId'),
      }),
      getTextFormItem({
        label: messages.labels.nonUserName,
        value: bookLoanUpdate.nonUserName,
        updateValueFunction: getUpdateValue(bookLoanUpdate, setBookLoanUpdate, 'nonUserName'),
      }),
      getTextFormItem({
        label: messages.labels.comment,
        value: bookLoanUpdate.comment,
        updateValueFunction: getUpdateValue(bookLoanUpdate, setBookLoanUpdate, 'comment'),
      }),
      getDateFormItem({
        label: messages.labels.until,
        value: bookLoanUpdate.until,
        updateValueFunction: (value: string | null | undefined): void => setBookLoanUpdate({
          ...bookLoanUpdate,
          until: !isNull(value) ? value : undefined,
        }),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
          startUpdateBorrowed(pathId, bookLoanUpdate);
          history.push(MenuPath.bookLoans);
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const BookLoanEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    bookLoanMap: bookLoanSelector.getAllActiveBookLoansMap(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    friends: friendshipSelector.getFriendUsers(state),
  }),
  {
    startUpdateBorrowed: bookLoanAction.startUpdateBookLoan,
  },
)(withRouter(withLoading(BaseBookLoanEditPage, bookLoanSelector.getAllBookLoansStatus)));
