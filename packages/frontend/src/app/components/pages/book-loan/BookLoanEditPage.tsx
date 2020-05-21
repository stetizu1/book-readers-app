import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Borrowed, BorrowedUpdate } from 'book-app-shared/types/Borrowed';
import { User } from 'book-app-shared/types/User';
import { BookData } from 'book-app-shared/types/BookData';
import { Book } from 'book-app-shared/types/Book';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertBorrowedToBorrowedUpdate } from 'book-app-shared/helpers/convert-to-update/borrowed';
import { isEmptyObject } from 'book-app-shared/helpers/validators';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { bookLoanAction } from 'app/modules/book-loan/bookLoanAction';
import { userSelector } from 'app/modules/user/userSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getNumberSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/number-nullable/getNumberSelectNullableFormItem';


interface StateProps {
  loansMap: IdMapOptional<Borrowed> | undefined;
  bookDataMap: IdMap<BookData> | undefined;
  usersMap: IdMap<User> | undefined;
  booksMap: IdMap<Book> | undefined;
  friends: User[] | undefined;
}

interface DispatchProps {
  startUpdateBorrowed: typeof bookLoanAction.startUpdateBookLoan;
}

type Props = StateProps & DispatchProps;

const messages = PageMessages.bookLoan;

const BaseBookLoanEditPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    loansMap, usersMap, booksMap,
    bookDataMap, friends,
    startUpdateBorrowed,
  } = props;

  const [bookLoanUpdate, setBookLoanUpdate] = useState<BorrowedUpdate>({});

  if (isUndefined(loansMap) || isUndefined(friends) || isUndefined(bookDataMap) || isUndefined(usersMap) || isUndefined(booksMap)) {
    return <UnknownError />;
  }

  const loan = loansMap[pathId];
  if (isUndefined(loan)) {
    return <NotFoundError />;
  }

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
    onSubmit: () => {
      startUpdateBorrowed(pathId, bookLoanUpdate);
    },
    isGoingBackOnSubmit: true,
  };

  return (
    <FormCard data={cardData} />
  );
};

export const BookLoanEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    loansMap: bookLoanSelector.getAllActiveBookLoansMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    bookDataMap: librarySelector.getAllBookDataMap(state),
    usersMap: userSelector.getUsersMap(state),
    friends: friendshipSelector.getFriendUsers(state),
  }),
  {
    startUpdateBorrowed: bookLoanAction.startUpdateBookLoan,
  },
)(withLoading(
  BaseBookLoanEditPage,
  bookLoanSelector.getAllBookLoansStatus,
  librarySelector.getAllBooksStatus, librarySelector.getAllBookDataStatus,
  userSelector.getUsersStatus,
  userSelector.getUsersStatus, userSelector.getCurrentUserStatus, friendshipSelector.getAllFriendshipStatus,
));
