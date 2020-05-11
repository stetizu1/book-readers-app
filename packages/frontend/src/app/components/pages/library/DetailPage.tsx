import React, { FC } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { LibraryPath, MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/helpers/withLoading';
import { ConfirmationDialogComponent } from 'app/components/common/ConfirmationDialogComponent';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { getButton } from 'app/components/common/blockCreators/getButton';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useContainerStyle } from 'app/components/common/styles/ContainerStyle';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';
import { getCardWithItem } from 'app/components/common/blockCreators/getCardWithItem';
import { getText } from 'app/components/common/blockCreators/getText';
import { getCardWithItems } from 'app/components/common/blockCreators/getCardWithItems';
import { getStars } from 'app/components/common/blockCreators/getStars';
import { getLabels } from 'app/components/common/blockCreators/getLabel';


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
  const buttonClasses = useButtonStyle();
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
    header: getHeader(PageMessages.bookDetail.bookDetailHeader),
    image: getImage(BookSharp),
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
          getLabels(labels),
        ],
      },
    },
    buttons: [
      getButton({
        variant: ButtonVariant.text,
        classType: buttonClasses.deleteOption,
        label: ButtonMessage.Delete,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }), getButton({
        variant: ButtonVariant.contained,
        classType: buttonClasses.edit,
        label: ButtonMessage.Edit,
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
      classType: buttonClasses.deleteButton,
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
