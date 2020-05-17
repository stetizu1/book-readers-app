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
import { WishlistPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';
import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { GridCards } from 'app/components/blocks/card-components/grid-cards/Cards';
import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { getItems } from '../../blocks/card-items/items-list/items/getItems';


interface StateProps {
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  wishlist: BookRequestWithBookData[] | undefined;
}

type Props = StateProps & RouteComponentProps;


const BaseWishlistPage: FC<Props> = (props) => {
  const {
    history,
    wishlist,
    authorsMap, booksMap, genresMap,
  } = props;

  if (isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(authorsMap) || isUndefined(wishlist)) {
    return null;
  }

  const getGridCardData = (bookRequest: BookRequestWithBookData): GridCardData => {
    const { bookData } = bookRequest;
    const book = booksMap[bookData.bookId];
    const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
    const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

    return {
      header: getCardHeader(book.name, StarsSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: bookData.publisher }),
      ],
      bottomLeftItems: [
        getItem({
          value: bookRequest.comment,
        }),
      ],
      topRightItems: [
        getItem({ value: bookData.format }),
        getItem({ value: genre?.name }),
      ],
      buttons: [
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            props.history.push(withParameterPath(WishlistPath.wishlistDetail, bookRequest.bookDataId));
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            props.history.push(withParameterPath(WishlistPath.wishlistEdit, bookRequest.bookDataId));
          },
        }),
      ],
    };
  };


  const buttons = [
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddBookRequest,
      onClick: (): void => {
        history.push(WishlistPath.wishlistAdd);
      },
    }),
  ];

  const getKey = (bookRequest: BookRequestWithBookData): string => String(bookRequest.bookDataId);
  return (
    <>
      {getPageHeader(PageMessages.wishlist.header)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={wishlist} getGridCardData={getGridCardData} getKey={getKey} />
    </>
  );
};

export const WishlistPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    wishlist: wishlistSelector.getWishlist(state),
  }),
  {},
)(withRouter(withLoading(BaseWishlistPage, wishlistSelector.getWishlistStatus)));
