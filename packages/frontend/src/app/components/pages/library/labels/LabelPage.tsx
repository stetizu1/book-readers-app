import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { LabelSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Label } from 'book-app-shared/types/Label';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { LibraryPath, MenuPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { ConfirmationDialog } from 'app/components/blocks/confirmation-dialog/ConfirmationDialog';
import { CardData } from 'app/components/blocks/card-components/card/Card';
import { Cards } from 'app/components/blocks/cards-component/cards/Cards';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';


interface StateProps {
  labels: Label[] | undefined;
}

interface DispatchProps {
  deleteLabel: typeof libraryAction.startDeleteLabel;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.labels;

const BaseLabelPage: FC<Props> = (props) => {
  const {
    labels, deleteLabel, setDialogState, history,
  } = props;
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  if (isUndefined(labels)) {
    return <UnknownError />;
  }

  const getCardData = (label: Label): CardData => ({
    header: getCardHeader(label.name, LabelSharp),
    items: [
      getItem({
        value: label.description,
      }),
    ],

    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          setDeleteId(label.id);
          setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          history.push(withParameterPath(LibraryPath.labelsEdit, label.id));
        },
      }),
    ],
  });

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        if (!isUndefined(deleteId)) {
          deleteLabel(deleteId);
          setDialogState(false);
        }
      },
    }),
  };

  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.BackToLibrary,
      onClick: (): void => {
        history.push(MenuPath.library);
      },
    }),
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddLabel,
      onClick: (): void => {
        history.push(LibraryPath.labelsAdd);
      },
    }),
  ];


  const getKey = (label: Label): string => String(label.id);
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <Cards data={labels} getCardData={getCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const LabelsPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    labels: librarySelector.getAllLabels(state),
  }),
  {
    deleteLabel: libraryAction.startDeleteLabel,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(
  BaseLabelPage,
  librarySelector.getAllLabelsStatus,
)));
