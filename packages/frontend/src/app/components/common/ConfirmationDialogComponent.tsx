import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { ButtonData, getButton, getHeader } from './getCardElement';
import { useDialogStyle } from './styles/DialogStyle';
import { useCardHeaderStyle } from './styles/CardHeaderStyle';
import { useCardStyle } from './styles/CardStyle';
import { useDialogColorStyle } from './styles/DialogColorStyle';
import { composeClasses } from '../../helpers/composeClasses';
import { useButtonStyle } from './styles/ButtonsStyle';
import { ButtonVariant } from '../../constants/css/ButtonVariant';
import { ButtonMessage } from '../../messages/ButtonMessage';
import { OnClickType } from '../../types/EventTypes';


export interface ConfirmationDialogData {
  header?: string;
  text?: string;
  onCancelClick: OnClickType;
  confirmButton: ButtonData;
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
  const headerClasses = useCardHeaderStyle();
  const buttonClasses = useButtonStyle();

  if (!props.isOpen) return null;

  const {
    onClick, variant, classType, label,
  } = props.data.confirmButton;
  return (
    <div className={cardClasses.container}>
      <div className={dialogClasses.background} />
      <Paper className={composeClasses(cardClasses.paper, dialogColorClasses.box, dialogClasses.forward)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid item xs={12} sm container className={cardClasses.inside}>
            <Grid item xs>
              {getHeader(props.data.header, headerClasses)}
              <div>{props.data.text}</div>
            </Grid>
          </Grid>
        </Grid>
        <div className={buttonClasses.containerOposite}>
          {getButton(props.data.onCancelClick, ButtonVariant.text, buttonClasses.cancel, ButtonMessage.Cancel)}
          {getButton(onClick, variant, classType, label)}
        </div>
      </Paper>
    </div>
  );
};
