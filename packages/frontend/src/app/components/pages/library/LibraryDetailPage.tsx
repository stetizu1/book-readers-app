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
}

interface DispatchProps {
  startReadBookData: typeof libraryAction.startReadBookData;
  deleteBookData: typeof libraryAction.startDeleteBookData;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.library;
const [bookDataSubHeader, personalBookDataSubHeader, reviewSubHeader, labelsSubHeader] = [messages.subHeaders.bookData, messages.subHeaders.personalBookData, messages.subHeaders.review, messages.subHeaders.labels];
const [bookDataLabels, personalBookDataLabels] = [messages.labels.bookData, messages.labels.personalBookData];

const BaseLibraryDetailPage: FC<Props> = (props) => {
  const { id: pathId } = useParams();
  const {
    startReadBookData, deleteBookData,
    history,
    setDialogState,
  } = props;

  const { data } = props;
  if (isUndefined(data) || data.bookData.id !== Number(pathId)) {
    startReadBookData(pathId);
    return null;
  }

  const {
    book, authors, bookData, personalBookData, review, genre, labels,
  } = data;

  const cardData: CardData = {
    header: getCardHeader(messages.detailHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getItem({ label: bookDataLabels.bookName, value: book.name }),
      getItems({ label: bookDataLabels.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataLabels.format, value: bookData.format }),
      getItem({ label: bookDataLabels.publisher, value: bookData.publisher }),
      getItem({ label: bookDataLabels.yearPublished, value: bookData.yearPublished }),
      getItem({ label: bookDataLabels.isbn, value: bookData.isbn }),
      getItem({ label: bookDataLabels.genre, value: genre?.name }),

      getSubHeader(personalBookDataSubHeader),
      getItem({ label: personalBookDataLabels.dateRead, value: personalBookData?.dateRead }),
      getItem({ label: personalBookDataLabels.comment, value: personalBookData?.comment }),

      getSubHeader(reviewSubHeader),
      getRating(review?.stars),
      getItem({ value: review?.comment }),

      getSubHeader(labelsSubHeader),
      getLabelsContainer(labels),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          setDialogState(true);
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

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        deleteBookData(bookData.id);
        setDialogState(false);
        history.push(MenuPath.library);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const LibraryDetailPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    data: librarySelector.getCurrentBookData(state),
  }),
  {
    startReadBookData: libraryAction.startReadBookData,
    deleteBookData: libraryAction.startDeleteBookData,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseLibraryDetailPage, userSelector.getCurrentUserStatus)));
