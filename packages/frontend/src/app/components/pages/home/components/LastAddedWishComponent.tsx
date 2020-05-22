import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { DoubleCard } from 'app/components/blocks/card-components/double-card/DoubleCard';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';


interface StateProps {
  wishlist: BookRequestWithBookData[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.home.lastAddedWish;

export const BaseLastAddedWishComponent: FC<Props> = (props) => {
  const {
    wishlist, authorsMap, booksMap, history,
  } = props;
  if (isUndefined(wishlist) || isUndefined(booksMap) || isUndefined(authorsMap)) {
    return <UnknownError />;
  }

  const isLeft = wishlist.length > 0;
  const isRight = wishlist.length > 1;

  const getElements = (bookRequestWithBookData: BookRequestWithBookData): JSX.Element[] => {
    const { bookData } = bookRequestWithBookData;
    const authors = booksMap[bookData.bookId].authorIds.map((authorId) => authorsMap[authorId]);
    return [
      getSubHeader(booksMap[bookData.bookId].name),
      getItems({ values: authors, structureKey: 'name' }),
      getItem({ value: !isNull(bookData.format) ? FormatMessage[bookData.format] : null }),
    ];
  };


  const leftItems = isLeft ? getElements(wishlist[0]) : undefined;
  const rightItems = isRight ? getElements(wishlist[1]) : undefined;

  return (
    <DoubleCard data={{
      header: getCardHeader(messages.header),
      itemsLeft: leftItems,
      itemsRight: rightItems,
      emptyMessage: messages.emptyMessage,
      button: getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ToWishlist,
        onClick: (): void => {
          history.push(MenuPath.wishlist);
        },
      }),
    }}
    />
  );
};

export const LastAddedWishComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    wishlist: wishlistSelector.getWishlistSorted(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
  }),
)(withRouter(withLoading(
  BaseLastAddedWishComponent,
  wishlistSelector.getWishlistStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
)));
