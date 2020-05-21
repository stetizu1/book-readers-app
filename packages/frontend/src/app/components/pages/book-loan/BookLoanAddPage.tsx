import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { PersonPinSharp, WarningSharp } from '@material-ui/icons';

import { BorrowedCreate } from 'book-app-shared/types/Borrowed';
import { Book } from 'book-app-shared/types/Book';
import { BookData } from 'book-app-shared/types/BookData';
import { User } from 'book-app-shared/types/User';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isEmptyObject } from 'book-app-shared/helpers/validators';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ErrorMessage } from 'app/messages/ErrorMessage';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { librarySelector } from 'app/modules/library/librarySelector';
import { bookLoanAction } from 'app/modules/book-loan/bookLoanAction';
import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { userSelector } from 'app/modules/user/userSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { EditCardData, FormCard } from 'app/components/blocks/card-components/form-card/FormCard';
import { InfoCard } from 'app/components/blocks/card-components/info-card/InfoCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getNumberSelectWithUndefinedFormItem } from 'app/components/blocks/card-items/items-form/select/number-with-undefined/getNumberSelectWithUndefinedFormItem';


interface StateProps {
  bookData: BookData[] | undefined;
  friends: User[] | undefined;
  booksMap: IdMap<Book> | undefined;
}

interface DispatchProps {
  startCreateBookLoan: typeof bookLoanAction.startCreateBookLoan;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.bookLoan;

const BaseBookLoanAddPage: FC<Props> = (props) => {
  const [bookLoanCreate, setBookLoanCreate] = useState<Partial<BorrowedCreate>>({});
  const {
    bookData,
    friends,
    booksMap,
    startCreateBookLoan,
    history,
  } = props;

  if (isUndefined(bookData) || isUndefined(booksMap) || isUndefined(friends)) {
    return <UnknownError />;
  }

  if (!bookData.length) {
    return (
      <InfoCard data={{
        header: getCardHeader(ErrorMessage.noBookToBorrow, WarningSharp),
        description: getDescription(ErrorMessage.noBookToBorrowDescription),
        buttons: [
          getButton({
            buttonType: ButtonType.button,
            label: ButtonMessage.ToLibrary,
            onClick: (): void => {
              history.push(MenuPath.library);
            },
          }),
        ],
      }}
      />
    );
  }

  if (isEmptyObject(bookLoanCreate)) {
    const defaultState = {
      bookDataId: bookData[0].id,
    };
    setBookLoanCreate(defaultState);
  }

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, PersonPinSharp),
    items: [
      getNumberSelectWithUndefinedFormItem({
        label: messages.labels.book,
        value: bookLoanCreate.bookDataId,
        options: bookData.map((data) => ({ name: booksMap[data.bookId].name, value: data.id })),
        required: true,
        updateValueFunction: getUpdateValue(bookLoanCreate, setBookLoanCreate, 'bookDataId'),
      }),
      getNumberSelectWithUndefinedFormItem({
        label: messages.labels.borrowedTo,
        value: bookLoanCreate.userBorrowedId,
        options: friends.map((user) => ({ name: isNull(user.name) ? user.email : user.name, value: user.id })),
        updateValueFunction: getUpdateValue(bookLoanCreate, setBookLoanCreate, 'userBorrowedId'),
      }),
      getTextFormItem({
        label: messages.labels.nonUserName,
        value: bookLoanCreate.nonUserName,
        updateValueFunction: getUpdateValue(bookLoanCreate, setBookLoanCreate, 'nonUserName'),
      }),
      getTextFormItem({
        label: messages.labels.comment,
        value: bookLoanCreate.comment,
        updateValueFunction: getUpdateValue(bookLoanCreate, setBookLoanCreate, 'comment'),
      }),
      getDateFormItem({
        label: messages.labels.until,
        value: bookLoanCreate.until,
        updateValueFunction: (value: string | null | undefined): void => setBookLoanCreate({
          ...bookLoanCreate,
          until: !isNull(value) ? value : undefined,
        }),
      }),
    ],
    onSubmit: () => {
      const id = bookLoanCreate.bookDataId;
      if (isUndefined(id)) return;
      const borrowCreate = {
        bookDataId: id,
        ...bookLoanCreate,
      };
      startCreateBookLoan(borrowCreate);
    },
    isGoingBackOnSubmit: true,
  };

  return (
    <FormCard data={cardData} />
  );
};

export const BookLoanAddPage = connect<{}, DispatchProps, {}, AppState>(
  (state) => ({
    booksMap: librarySelector.getAllBooksMap(state),
    bookData: librarySelector.getAllNotBorrowedBookData(state),
    friends: friendshipSelector.getFriendUsers(state),
  }),
  {
    startCreateBookLoan: bookLoanAction.startCreateBookLoan,
  },
)(withLoading(
  BaseBookLoanAddPage,
  librarySelector.getAllBooksStatus, librarySelector.getAllBookDataStatus,
  bookLoanSelector.getAllBookLoansStatus,
  userSelector.getUsersStatus, userSelector.getCurrentUserStatus, friendshipSelector.getAllFriendshipStatus,
));
