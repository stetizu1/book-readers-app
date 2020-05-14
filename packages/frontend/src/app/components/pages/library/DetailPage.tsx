import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { LibraryPath, MenuPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/ButtonType';

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
import { ConfirmationDialogComponent } from 'app/components/blocks/ConfirmationDialogComponent';
import { CardComponent, CardData } from 'app/components/blocks/CardComponent';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';
import { getHeader } from 'app/components/blocks/card-components/header/getHeader';
import { getCardWithItem } from 'app/components/blocks/card-items/getCardWithItem';
import { getText } from 'app/components/blocks/card-items/getText';
import { getCardWithItems } from 'app/components/blocks/card-items/getCardWithItems';
import { getStars } from 'app/components/blocks/card-items/getStars';
import { getLabelsContainer } from 'app/components/blocks/card-items/getLabelsContainer';


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
  const classes = useContainerStyle();
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
    header: getHeader(PageMessages.bookDetail.bookDetailHeader, BookSharp),
    items: {
      left: {
        top: [
          getText(subHeaders.bookData.header, true),
          getCardWithItem({ label: subHeaders.bookData.bookName, value: book.name }),
          getCardWithItems({ label: subHeaders.bookData.authorName, values: authors, structureKey: 'name' }),
          getCardWithItem({ label: subHeaders.bookData.format, value: bookData.format }),
          getCardWithItem({ label: subHeaders.bookData.publisher, value: bookData.publisher }),
          getCardWithItem({ label: subHeaders.bookData.yearPublished, value: bookData.yearPublished }),
          getCardWithItem({ label: subHeaders.bookData.isbn, value: bookData.isbn }),
          getCardWithItem({ label: subHeaders.bookData.genre, value: genre?.name }),
          <hr />,
          getText(subHeaders.personalBookData.header, true),
          getCardWithItem({ label: subHeaders.personalBookData.read, value: personalBookData?.dateRead }),
          getCardWithItem({ label: subHeaders.personalBookData.comment, value: personalBookData?.comment }),
          <hr />,
          getText(subHeaders.review.header, true),
          getStars(review?.stars),
          getCardWithItem({ value: review?.comment }),
          <hr />,
          getText(subHeaders.labels, true),
          getLabelsContainer(labels),
        ],
      },
    },
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }), getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          props.history.push(withParameterPath(LibraryPath.editBookData, bookData.id));
        },
      }),
    ],
  };

  const confirmationData = {
    header: getHeader(PageMessages.bookDetail.delete.header),
    text: getText(PageMessages.bookDetail.delete.description),
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
      <div className={classes.container}>
        <CardComponent data={cardData} />
      </div>
      <ConfirmationDialogComponent data={confirmationData} isOpen={props.isConfirmDialogOpen} />
    </>
  );
};

export const DetailPage = connect<StateProps, DispatchProps, {}, AppState>(
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
