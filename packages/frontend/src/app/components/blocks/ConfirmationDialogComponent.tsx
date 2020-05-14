import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { ButtonLayoutType } from 'app/constants/style/ButtonLayoutType';

import { OnClickType } from 'app/types/EventTypes';

import { composeClasses } from 'app/helpers/style/composeClasses';
import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';


import { useDialogStyle } from 'app/components/blocks/styles/dialog/DialogStyle';
import { useCardStyle } from 'app/components/blocks/styles/cardItems/CardStyle';
import { useDialogColorStyle } from 'app/components/blocks/styles/dialog/DialogColorStyle';
import { ButtonType } from '../../constants/style/ButtonType';
import { HeaderComponentType } from './card-components/header/getHeader';
import { DescriptionComponentType } from './card-components/description/getDescription';
import { getButtonsLayout } from './card-components/button-layout/getButtonsLayout';

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


export const ConfirmationDialogComponent = (props: Props): JSX.Element | null => {
  const cardClasses = useCardStyle();
  const dialogClasses = useDialogStyle();
  const dialogColorClasses = useDialogColorStyle();


  if (!props.isOpen) return null;

  const {
    header = null,
    description = null,
    confirmButton,
  } = props.data;

  const buttons = [
    getButton({
      buttonType: ButtonType.dialogCancel,
      onClick: props.data.onCancelClick,
    }),
    confirmButton,
  ];

  return (
    <div className={cardClasses.container}>
      <div className={dialogClasses.background} />
      <Paper className={composeClasses(cardClasses.paper, dialogColorClasses.box, dialogClasses.forward)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid item xs={12} sm container className={cardClasses.inside}>
            <Grid item xs>
              <div>
                {header}
                {description}
              </div>
            </Grid>
          </Grid>
        </Grid>
        {getButtonsLayout(buttons, ButtonLayoutType.opposite)}
      </Paper>
    </div>
  );
};
