import React, { FC } from 'react';
import { connect } from 'react-redux';
import { BookSharp } from '@material-ui/icons';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { User } from 'book-app-shared/types/User';
import { BookDataWithReview } from 'book-app-shared/types/BookData';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { librarySelector } from 'app/modules/library/librarySelector';
import { friendsDataSelector } from 'app/modules/friends-data/friendshipSelector';
import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';


interface StateProps {
  friendsMap: IdMapOptional<User> | undefined;

  allFriendsBookData: BookDataWithReview[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.library;

const BaseLibraryPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    friendsMap,
    allFriendsBookData, authorsMap, booksMap, genresMap,
    history,
  } = props;

  if (isUndefined(friendsMap) || isUndefined(allFriendsBookData)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap)) {
    return <UnknownError />;
  }

  const friend = friendsMap[pathId];
  if (isUndefined(friend)) {
    return <NotFoundError />;
  }

  const getGridCardData = (bookData: BookDataWithReview): GridCardData => {
    const {
      format, publisher, bookId, genreId, isbn, yearPublished, review,
    } = bookData;

    const book = booksMap[bookId];
    const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
    const genre = !isNull(genreId) ? genresMap[genreId] : null;

    return {
      header: getCardHeader(book.name, BookSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: publisher }),
        getItem({ value: yearPublished }),
        getItem({ value: isbn }),
        getItem({ value: publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: review?.comment }),
      ],
      topRightItems: [
        getItem({ value: isNull(format) ? null : FormatMessage[format] }),
        getItem({ value: genre?.name }),
      ],
      bottomRightItems: [
        getRating(review?.stars),
      ],
    };
  };
  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.BackToFriends,
      onClick: (): void => {
        history.push(MenuPath.friends);
      },
    }),
  ];

  const getKey = (bookData: BookDataWithReview): string => String(bookData.id);
  return (
    <>
      {getPageHeader(`${messages.pageHeader} ${messages.user} ${friend.name || friend.email}`)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards
        data={allFriendsBookData.filter((data) => data.userId === friend.id)}
        getGridCardData={getGridCardData}
        getKey={getKey}
      />
    </>
  );
};

export const FriendsLibraryPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    friendsMap: userSelector.getUsersMap(state),
    allFriendsBookData: friendsDataSelector.getAllFriendsDataBookData(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
  }),
)(withRouter(withLoading(
  BaseLibraryPage,
  userSelector.getUsersStatus,
  friendsDataSelector.getAllFriendsDataBookDataStatus,
  librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus,
)));
