import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';

import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { AppState } from 'app/types/AppState';

import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';
import { ButtonType } from 'app/constants/style/types/ButtonType';
import { DescriptionComponentType } from 'app/components/blocks/card-layout/body/description/getDescription';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { useConfirmationDialogStyle } from './useConfirmationDialogStyle';


export interface ConfirmationDialogData {
  header?: HeaderComponentType;
  description?: DescriptionComponentType;
  confirmButton: ButtonComponentType;
}

interface InputProps {
  data: ConfirmationDialogData;
}

interface StateProps {
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  setDialogState: typeof dialogAction.setOpen;
}

type Props = InputProps & StateProps & DispatchProps;


const BaseConfirmationDialog: FC<Props> = (props) => {
  const classes = useConfirmationDialogStyle();

  const {
    isConfirmDialogOpen,
    data,
    setDialogState,
  } = props;

  if (!isConfirmDialogOpen) return null;

  const {
    header = null,
    description = null,
    confirmButton,
  } = data;

  const buttons = [
    getButton({
      buttonType: ButtonType.cancel,
      onClick: () => setDialogState(false),
    }),
    confirmButton,
  ];

  return (
    <>
      <div className={classes.background} />
      <Paper className={classes.foreground}>
        {header}
        {description}
        {getButtonsLayout(buttons, ButtonLayoutType.opposite)}
      </Paper>
    </>
  );
};

export const ConfirmationDialog = connect<StateProps, DispatchProps, InputProps, AppState>(
  (state) => ({
    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  {
    setDialogState: dialogAction.setOpen,
  },
)(BaseConfirmationDialog);
