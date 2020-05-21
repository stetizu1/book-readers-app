import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookDataWithReview } from 'book-app-shared/types/BookData';
import { User } from 'book-app-shared/types/User';
import { Borrowed } from 'book-app-shared/types/Borrowed';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { BookLoansPath, MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { librarySelector } from 'app/modules/library/librarySelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';
import { friendsDataSelector } from 'app/modules/friends-data/friendshipSelector';
import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { DoubleCard } from 'app/components/blocks/card-components/double-card/DoubleCard';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getInlineItem } from 'app/components/blocks/card-items/items-list/inline-item/getInlineItem';


interface StateProps {
  borrowed: Borrowed[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  users: IdMap<User> | undefined;
  friendsBookDataMap: IdMap<BookDataWithReview> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.home.expiringBorrowed;

export const BaseSoonExpiringComponent: FC<Props> = (props) => {
  const {
    borrowed, authorsMap, booksMap,
    friendsBookDataMap,
    users,
    history,
  } = props;
  if (isUndefined(borrowed) || isUndefined(booksMap) || isUndefined(authorsMap) || isUndefined(friendsBookDataMap) || isUndefined(users)) {
    return <UnknownError />;
  }

  const isLeft = borrowed.length > 0;
  const isRight = borrowed.length > 1;

  const getElements = (loan: Borrowed): JSX.Element[] => {
    const bookData = friendsBookDataMap[loan.bookDataId];
    const loaningUser = isNull(bookData.userId) ? null : users[bookData.userId];
    const loaningUserNameOrEmail = isNull(loaningUser?.name) ? loaningUser?.email : loaningUser?.name;
    const authors = booksMap[bookData.bookId].authorIds.map((authorId) => authorsMap[authorId]);
    return [
      getSubHeader(booksMap[bookData.bookId].name),
      getItems({ values: authors, structureKey: 'name' }),
      getInlineItem({ label: messages.labels.until, value: loan.until }),
      getInlineItem({ label: messages.labels.return, value: loaningUserNameOrEmail }),
    ];
  };


  const leftItems = isLeft ? getElements(borrowed[0]) : undefined;
  const rightItems = isRight ? getElements(borrowed[1]) : undefined;

  return (
    <DoubleCard data={{
      header: getCardHeader(messages.header),
      itemsLeft: leftItems,
      itemsRight: rightItems,
      emptyMessage: messages.emptyMessage,
      button: getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ToBorrowed,
        onClick: (): void => {
          history.push(BookLoansPath.borrowed);
        },
      }),
      emptyButton: getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ToBookLoan,
        onClick: (): void => {
          history.push(MenuPath.bookLoans);
        },
      }),
    }}
    />
  );
};

export const SoonExpiringComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    borrowed: bookLoanSelector.getAllActiveBorrowedSorted(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    users: userSelector.getUsersMap(state),
    friendsBookDataMap: friendsDataSelector.getAllFriendsDataBookDataMap(state),
  }),
)(withRouter(withLoading(
  BaseSoonExpiringComponent,
  bookLoanSelector.getAllBorrowedStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  friendsDataSelector.getAllFriendsDataBookDataStatus,
  userSelector.getUsersStatus,
  userSelector.getUsersStatus,
)));
