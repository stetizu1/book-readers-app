import React from 'react';
import { Paper } from '@material-ui/core';

import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { OnClickType } from 'app/types/EventTypes';

import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';


import { ButtonType } from 'app/constants/style/types/ButtonType';
import { DescriptionComponentType } from 'app/components/blocks/card-layout/body/description/getDescription';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { useConfirmationDialogStyle } from './useConfirmationDialogStyle';

export interface ConfirmationDialogData {
  header?: HeaderComponentType;
  description?: DescriptionComponentType;
  onCancelClick: OnClickType;
  confirmButton: ButtonComponentType;
}

interface InputProps {
  data: ConfirmationDialogData;
  isOpen: boolean;
}

type Props = InputProps;


export const ConfirmationDialog = (props: Props): JSX.Element | null => {
  const classes = useConfirmationDialogStyle();


  if (!props.isOpen) return null;

  const {
    header = null,
    description = null,
    confirmButton,
  } = props.data;

  const buttons = [
    getButton({
      buttonType: ButtonType.cancel,
      onClick: props.data.onCancelClick,
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
