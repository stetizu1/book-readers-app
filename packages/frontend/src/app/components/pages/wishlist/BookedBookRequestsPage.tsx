import React, { FC } from 'react';
import { connect } from 'react-redux';
import { StarsSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Genre } from 'book-app-shared/types/Genre';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';

import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';


interface StateProps {
  bookedBookRequests: BookRequestWithBookData[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

interface DispatchProps {
  bookBookRequest: typeof wishlistAction.startBookBookRequest;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.wishlist;

const BaseBookedBookRequests: FC<Props> = (props) => {
  const {
    history,
    bookedBookRequests,
    authorsMap, booksMap, genresMap,
    bookBookRequest,
  } = props;

  if (isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(authorsMap) || isUndefined(bookedBookRequests)) {
    return <UnknownError />;
  }

  const getGridCardData = (bookRequest: BookRequestWithBookData): GridCardData => {
    const { bookData } = bookRequest;
    const book = booksMap[bookData.bookId];
    const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
    const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

    const getButtons = (): ButtonComponentType[] => {
      if (!bookRequest.createdByBookingUser) {
        return [
          getButton({
            buttonType: ButtonType.dialogDelete,
            label: ButtonMessage.UnbookBookRequest,
            onClick: (): void => {
              bookBookRequest(bookRequest.bookDataId, null);
            },
          }),
        ];
      }
      return []; // todo detail/edit
    };

    return {
      header: getCardHeader(book.name, StarsSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: bookData.publisher }),
      ],
      topRightItems: [
        getItem({ value: bookData.format }),
        getItem({ value: genre?.name }),
      ],
      bottomRightItems: [
        getItem({
          value: bookRequest.comment,
        }),
      ],
      buttons: getButtons(),
    };
  };


  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.BackToWishlist,
      onClick: (): void => {
        history.push(MenuPath.wishlist);
      },
    }),
  ];

  const getKey = (bookRequest: BookRequestWithBookData): string => String(bookRequest.bookDataId);
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards
        data={bookedBookRequests}
        getGridCardData={getGridCardData}
        getKey={getKey}
        description={messages.emptyDescription}
        button={getButton({
          buttonType: ButtonType.button,
          label: ButtonMessage.ToFriends,
          onClick: (): void => {
            history.push(MenuPath.friends);
          },
        })}
      />
    </>
  );
};

export const BookedBookRequests = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookedBookRequests: wishlistSelector.getBookedBookRequests(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
  }), {
    bookBookRequest: wishlistAction.startBookBookRequest,
  },
)(withRouter(withLoading(
  BaseBookedBookRequests,
  wishlistSelector.getBookedBookRequestsStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllGenresStatus,
)));
