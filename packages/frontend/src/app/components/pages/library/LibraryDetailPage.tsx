import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { LibraryPath, MenuPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getLabelsContainer } from 'app/components/blocks/card-items/items-list/labels-container/getLabelsContainer';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  data: CurrentBookData | undefined;
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  startGetBookData: typeof libraryAction.startGetBookData;
  deleteBookData: typeof libraryAction.startDeleteBookData;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;


const BaseProfilePage: FC<Props> = (props) => {
  const { id: pathId } = useParams();

  const { data } = props;
  if (isUndefined(data) || data.bookData.id !== Number(pathId)) {
    props.startGetBookData(pathId);
    return null;
  }

  const {
    book, authors, bookData, personalBookData, review, genre, labels,
  } = data;
  const { subHeaders } = PageMessages.bookDetail;

  const cardData: CardData = {
    header: getCardHeader(PageMessages.bookDetail.bookDetailHeader, BookSharp),
    items: [
      getSubHeader(subHeaders.bookData.header),
      getItem({ label: subHeaders.bookData.bookName, value: book.name }),
      getItems({ label: subHeaders.bookData.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: subHeaders.bookData.format, value: bookData.format }),
      getItem({ label: subHeaders.bookData.publisher, value: bookData.publisher }),
      getItem({ label: subHeaders.bookData.yearPublished, value: bookData.yearPublished }),
      getItem({ label: subHeaders.bookData.isbn, value: bookData.isbn }),
      getItem({ label: subHeaders.bookData.genre, value: genre?.name }),

      getSubHeader(subHeaders.personalBookData.header),
      getItem({ label: subHeaders.personalBookData.read, value: personalBookData?.dateRead }),
      getItem({ label: subHeaders.personalBookData.comment, value: personalBookData?.comment }),

      getSubHeader(subHeaders.review.header),
      getRating(review?.stars),
      getItem({ value: review?.comment }),

      getSubHeader(subHeaders.labels),
      getLabelsContainer(labels),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          props.history.push(withParameterPath(LibraryPath.bookEdit, bookData.id));
        },
      }),
    ],
  };

  const confirmationData = {
    header: getCardHeader(PageMessages.bookDetail.delete.header),
    description: getDescription(PageMessages.bookDetail.delete.description),
    onCancelClick: (): void => {
      props.setDialogState(false);
    },
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        props.deleteBookData(bookData.id);
        props.setDialogState(false);
        props.history.push(MenuPath.library);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} isOpen={props.isConfirmDialogOpen} />
    </>
  );
};

export const LibraryDetailPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    data: librarySelector.getCurrentBookData(state),
    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  {
    startGetBookData: libraryAction.startGetBookData,
    deleteBookData: libraryAction.startDeleteBookData,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseProfilePage, userSelector.getCurrentUserStatus)));
