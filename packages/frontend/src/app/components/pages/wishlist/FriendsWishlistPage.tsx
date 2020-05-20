import React, { FC } from 'react';
import { connect } from 'react-redux';
import { StarsSharp } from '@material-ui/icons';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Genre } from 'book-app-shared/types/Genre';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { WishlistPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { friendsDataSelector } from 'app/modules/friends-data/friendshipSelector';
import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getInlineItem } from 'app/components/blocks/card-items/items-list/inline-item/getInlineItem';


interface StateProps {
  wishlistArray: BookRequestWithBookData[] | undefined;
  friendsMap: IdMapOptional<User> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  currentUserId: number | undefined;
}

interface DispatchProps {
  bookBookRequest: typeof wishlistAction.startBookBookRequest;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.wishlist;

const BaseFriendsWishlistPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    history,
    wishlistArray,
    authorsMap, booksMap, genresMap, friendsMap,
    currentUserId,
    bookBookRequest,
  } = props;

  if (isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(authorsMap) || isUndefined(wishlistArray) || isUndefined(friendsMap) || isUndefined(currentUserId)) {
    return <UnknownError />;
  }

  if (isUndefined(friendsMap[pathId])) {
    return <NotFoundError />;
  }

  const bookRequests = wishlistArray.filter((request) => request.userId === pathId);

  const getGridCardData = (bookRequest: BookRequestWithBookData): GridCardData => {
    const { bookData } = bookRequest;
    const book = booksMap[bookData.bookId];
    const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
    const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

    const bookingUserId = bookRequest.userBookingId;

    const getButtons = (): ButtonComponentType[] => {
      if (isNull(bookingUserId)) {
        return [
          getButton({
            buttonType: ButtonType.edit,
            label: ButtonMessage.bookBookRequest,
            onClick: (): void => {
              bookBookRequest(bookRequest.bookDataId, currentUserId);
            },
          }),
        ];
      }
      if (bookingUserId === currentUserId) {
        if (!bookRequest.createdByBookingUser) {
          return [
            getButton({
              buttonType: ButtonType.dialogDelete,
              label: ButtonMessage.unbookBookRequest,
              onClick: (): void => {
                bookBookRequest(bookRequest.bookDataId, null);
              },
            }),
          ];
        }
        return []; // todo detail/edit
      }
      return [];
    };

    return {
      header: getCardHeader(book.name, StarsSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: bookData.publisher }),
      ],
      bottomLeftItems: [
        getInlineItem({ label: messages.labels.createdByBooking, value: bookRequest.createdByBookingUser }),
        getInlineItem({ label: messages.labels.booked, value: !isNull(bookingUserId) }),
        getItem({ value: !isNull(bookingUserId) ? friendsMap[bookingUserId] : undefined }),
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
      buttonType: ButtonType.save,
      label: ButtonMessage.AddBookRequestToFriend,
      onClick: (): void => {
        history.push(WishlistPath.wishlistAddToFriend);
      },
    }),
  ];

  const getKey = (bookRequest: BookRequestWithBookData): string => String(bookRequest.bookDataId);
  return (
    <>
      {getPageHeader(`${messages.pageHeader} ${friendsMap[pathId]?.name || friendsMap[pathId]?.email}`)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={bookRequests} getGridCardData={getGridCardData} getKey={getKey} />
    </>
  );
};

export const FriendsWishlistPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    wishlistArray: friendsDataSelector.getAllFriendsBookRequests(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    friendsMap: userSelector.getUsersMap(state),
    currentUserId: userSelector.getCurrentUserId(state),
  }), {
    bookBookRequest: wishlistAction.startBookBookRequest,
  },
)(withRouter(withLoading(
  BaseFriendsWishlistPage,
  friendsDataSelector.getAllFriendsBookRequestsStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllGenresStatus,
  userSelector.getUsersStatus, userSelector.getCurrentUserStatus, friendshipSelector.getAllFriendshipStatus,
  userSelector.getCurrentUserStatus,
)));
