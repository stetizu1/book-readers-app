import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { DeleteForeverSharp, StarsSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Genre } from 'book-app-shared/types/Genre';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath, WishlistPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { ConfirmationDialog } from 'app/components/blocks/confirmation-dialog/ConfirmationDialog';

import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  wishlist: BookRequestWithBookData[] | undefined;
}

interface DispatchProps {
  deleteBookRequest: typeof wishlistAction.startDeleteBookRequest;
  setDialogState: typeof dialogAction.setState;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.wishlist;

const BaseWishlistPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const {
    wishlist,
    authorsMap, booksMap, genresMap,
    deleteBookRequest, setDialogState,
    history,
  } = props;

  if (isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(authorsMap) || isUndefined(wishlist)) {
    return <UnknownError />;
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
      topRightItems: [
        getItem({ value: bookData.format }),
        getItem({ value: genre?.name }),
      ],
      bottomRightItems: [
        getItem({
          value: bookRequest.comment,
        }),
      ],
      deleteButton: getButton({
        buttonType: ButtonType.dialogDelete,
        label: <DeleteForeverSharp />,
        onClick: (): void => {
          setDeleteId(bookRequest.bookDataId);
          setDialogState(true);
        },
      }),
      buttons: [
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            history.push(withParameterPath(WishlistPath.wishlistEdit, bookRequest.bookDataId));
          },
        }),
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            history.push(withParameterPath(WishlistPath.wishlistDetail, bookRequest.bookDataId));
          },
        }),
      ],
    };
  };


  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.ToBookedBookRequests,
      onClick: (): void => {
        history.push(WishlistPath.bookedBookRequests);
      },
    }),
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddBookRequest,
      onClick: (): void => {
        history.push(WishlistPath.wishlistAdd);
      },
    }),
  ];

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        if (!isUndefined(deleteId)) {
          deleteBookRequest(deleteId);
          setDialogState(false);
          history.push(MenuPath.wishlist);
        }
      },
    }),
  };


  const getKey = (bookRequest: BookRequestWithBookData): string => String(bookRequest.bookDataId);
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={wishlist} getGridCardData={getGridCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const WishlistPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    wishlist: wishlistSelector.getWishlist(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
  }), {
    deleteBookRequest: wishlistAction.startDeleteBookRequest,
    setDialogState: dialogAction.setState,
  },
)(withRouter(withLoading(
  BaseWishlistPage,
  wishlistSelector.getWishlistStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllGenresStatus,
)));
