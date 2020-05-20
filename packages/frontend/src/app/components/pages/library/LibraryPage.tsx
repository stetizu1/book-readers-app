import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { BookSharp, DeleteForeverSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataWithLabelIds, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { LibraryPath, MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { GridCards } from 'app/components/blocks/cards-component/grid-cards/Cards';
import { ConfirmationDialog } from 'app/components/blocks/confirmation-dialog/ConfirmationDialog';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getLabelsContainer } from 'app/components/blocks/card-items/items-list/labels-container/getLabelsContainer';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getInlineItem } from 'app/components/blocks/card-items/items-list/inline-item/getInlineItem';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  allBookData: BookDataWithLabelIds[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  labelsMap: IdMap<Label> | undefined;
  reviewsMap: IdMapOptional<Review> | undefined;
  personalBookDataMap: IdMapOptional<PersonalBookData> | undefined;
}

interface DispatchProps {
  deleteBookData: typeof libraryAction.startDeleteBookData;
  setDialogState: typeof dialogAction.setState;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.library;

const BaseLibraryPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const {
    allBookData, authorsMap, booksMap, genresMap, labelsMap, personalBookDataMap, reviewsMap,
    deleteBookData, setDialogState,
    history,
  } = props;

  if (isUndefined(allBookData)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(labelsMap)
    || isUndefined(reviewsMap) || isUndefined(personalBookDataMap)) {
    return <UnknownError />;
  }

  const getGridCardData = (bookData: BookDataWithLabelIds): GridCardData => {
    const {
      id, format, publisher, bookId, genreId,
    } = bookData;

    const authors = booksMap[bookId].authorIds.map((authorId) => authorsMap[authorId]);

    const labels = isBookDataWithLabelsIds(bookData) ? bookData.labelsIds.map((labelId) => labelsMap[labelId]) : [];
    const genre = !isNull(genreId) ? genresMap[genreId] : null;

    return {
      header: getCardHeader(booksMap[bookId].name, BookSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: personalBookDataMap[id]?.comment }),
        getLabelsContainer(labels),
      ],

      topRightItems: [
        getItem({ value: format }),
        getItem({ value: genre?.name }),
      ],
      bottomRightItems: [
        getInlineItem({ label: messages.labels.personalBookData.dateRead, value: personalBookDataMap[id]?.dateRead }),
        getRating(reviewsMap[id]?.stars),
      ],
      deleteButton: getButton({
        buttonType: ButtonType.dialogDelete,
        label: <DeleteForeverSharp />,
        onClick: (): void => {
          setDeleteId(bookData.id);
          setDialogState(true);
        },
      }),
      buttons: [
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            history.push(withParameterPath(LibraryPath.bookDetail, bookData.id));
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            history.push(withParameterPath(LibraryPath.bookEdit, bookData.id));
          },
        }),
      ],
    };
  };
  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.Labels,
      onClick: (): void => {
        history.push(LibraryPath.labels);
      },
    }),
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddBook,
      onClick: (): void => {
        history.push(LibraryPath.bookAdd);
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
          deleteBookData(deleteId);
          setDialogState(false);
          history.push(MenuPath.library);
        }
      },
    }),
  };

  const getKey = (bookData: BookDataWithLabelIds): string => String(bookData.id);
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={allBookData} getGridCardData={getGridCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const LibraryPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    allBookData: librarySelector.getAllBookData(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    labelsMap: librarySelector.getAllLabelsMap(state),
    reviewsMap: librarySelector.getAllReviewsMap(state),
    personalBookDataMap: librarySelector.getAllPersonalBookDataMap(state),
  }), {
    deleteBookData: libraryAction.startDeleteBookData,
    setDialogState: dialogAction.setState,
  },
)(withRouter(withLoading(
  BaseLibraryPage,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus, librarySelector.getAllLabelsStatus,
  librarySelector.getAllReviewsStatus, librarySelector.getAllPersonalBookDataStatus,
)));
