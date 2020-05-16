import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { LabelSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Label } from 'book-app-shared/types/Label';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { LibraryPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';

import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';


interface StateProps {
  labels: Label[] | undefined;
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  deleteLabel: typeof libraryAction.startDeleteLabel;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;


const BaseLabelPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const { labels } = props;

  if (isUndefined(labels)) {
    return null;
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
          props.setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          props.history.push(withParameterPath(LibraryPath.labelsEdit, label.id));
        },
      }),
    ],
  });

  const confirmationData = {
    header: getCardHeader(PageMessages.labels.delete.header),
    description: getDescription(PageMessages.labels.delete.description),
    onCancelClick: (): void => {
      props.setDialogState(false);
    },
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        if (!isUndefined(deleteId)) {
          props.deleteLabel(deleteId);
          props.setDialogState(false);
        }
      },
    }),
  };

  const buttons = [
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddLabel,
      onClick: (): void => {
        props.history.push(LibraryPath.labelsAdd);
      },
    }),
  ];

  return (
    <>
      {getPageHeader(PageMessages.library.labelsHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      {labels.map((label) => (
        <Card data={getCardData(label)} key={label.id} />
      ))}
      <ConfirmationDialog data={confirmationData} isOpen={props.isConfirmDialogOpen} />
    </>
  );
};

export const LabelsPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    labels: librarySelector.getAllLabels(state),
    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  {
    deleteLabel: libraryAction.startDeleteLabel,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseLabelPage, librarySelector.getAllLabelsStatus)));
