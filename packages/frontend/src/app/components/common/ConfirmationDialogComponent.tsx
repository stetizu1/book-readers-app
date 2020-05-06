import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';

import { ButtonMessage } from 'app/messages/ButtonMessage';

import { OnClickType } from 'app/types/EventTypes';

import { composeClasses } from 'app/helpers/style/composeClasses';
import { ButtonType, getButton } from 'app/components/common/blockCreators/getButton';
import { getHeader } from 'app/components/common/blockCreators/getHeader';


import { useDialogStyle } from 'app/components/common/styles/dialog/DialogStyle';
import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';
import { useDialogColorStyle } from 'app/components/common/styles/dialog/DialogColorStyle';
import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useButtonsOverlayStyle } from 'app/components/common/styles/buttons/ButtonsOverlayStyle';

export interface ConfirmationDialogData {
  header?: string;
  text?: string;
  onCancelClick: OnClickType;
  confirmButton: ButtonType;
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
  const buttonsOverlayClasses = useButtonsOverlayStyle();
  const buttonClasses = useButtonStyle();

  if (!props.isOpen) return null;

  return (
    <div className={cardClasses.container}>
      <div className={dialogClasses.background} />
      <Paper className={composeClasses(cardClasses.paper, dialogColorClasses.box, dialogClasses.forward)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid item xs={12} sm container className={cardClasses.inside}>
            <Grid item xs>
              {getHeader(props.data.header)}
              <div>{props.data.text}</div>
            </Grid>
          </Grid>
        </Grid>
        <div className={buttonsOverlayClasses.opposite}>
          {getButton({
            onClick: props.data.onCancelClick,
            variant: ButtonVariant.text,
            classType: buttonClasses.cancel,
            label: ButtonMessage.Cancel,
          })}
          {props.data.confirmButton}
        </div>
      </Paper>
    </div>
  );
};
