import React, { FC } from 'react';
import { connect } from 'react-redux';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { librarySelector } from 'app/modules/library/librarySelector';
import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { Card } from 'app/components/blocks/card-components/card/Card';
import { getInlineItem } from 'app/components/blocks/card-items/items-list/inline-item/getInlineItem';


interface StateProps {
  bookDataCount: number | undefined;
  friendshipsCount: number | undefined;
  reviewsCount: number | undefined;
  borrowed: number | undefined;
  loaned: number | undefined;
}

type Props = StateProps;

const messages = PageMessages.home.stats;

export const BaseStatsComponent: FC<Props> = (props) => {
  const {
    bookDataCount, friendshipsCount, reviewsCount, borrowed, loaned,
  } = props;
  if (isUndefined(bookDataCount) || isUndefined(friendshipsCount) || isUndefined(reviewsCount) || isUndefined(borrowed) || isUndefined(loaned)) {
    return <UnknownError />;
  }

  const items = [
    getInlineItem({ label: messages.labels.booksInLibrary, value: bookDataCount }),
    getInlineItem({ label: messages.labels.friends, value: friendshipsCount }),
    getInlineItem({ label: messages.labels.givenReviews, value: reviewsCount }),
    getInlineItem({ label: messages.labels.borrowedBooks, value: borrowed }),
    getInlineItem({ label: messages.labels.activeBookLoans, value: loaned }),
  ];


  return (
    <Card data={{
      header: getCardHeader(messages.header),
      items,
    }}
    />
  );
};

export const StatsComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookDataCount: librarySelector.getBookDataCount(state),
    friendshipsCount: friendshipSelector.getFriendshipCount(state),
    reviewsCount: librarySelector.getReviewsCount(state),
    borrowed: bookLoanSelector.getBorrowedCount(state),
    loaned: bookLoanSelector.getBookLoanedCount(state),
  }),
)(withLoading(
  BaseStatsComponent,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllReviewsStatus,
  friendshipSelector.getAllFriendshipStatus,
  bookLoanSelector.getAllBorrowedStatus,
  bookLoanSelector.getAllBookLoansStatus,
));
