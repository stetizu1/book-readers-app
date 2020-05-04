import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { dataToMessage } from '../../helpers/dataToMessage';

import { Call } from '../../types/CallResult';
import { useImageCardStyle } from './styles/ImageCardStyle';
import { useCardItemStyle } from './styles/CardItemStyle';
import { useCardHeaderStyle } from './styles/CardHeaderStyle';
import { ButtonVariant } from '../../constants/css/ButtonVariant';
import { OnClickType } from '../../types/EventTypes';
import { useButtonStyle } from './styles/ButtonsStyle';
import { ButtonMessage } from '../../messages/ButtonMessage';


export type CssClassType<T extends Call> = ReturnType<T>[keyof ReturnType<T>];

export const getImage = (
  IconImage: SvgIconComponent | undefined,
  classes: ReturnType<typeof useImageCardStyle>,
): JSX.Element | null => {
  if (isUndefined(IconImage)) return null;
  return (
    <Grid item className={classes.image}>
      <IconImage fontSize="inherit" />
    </Grid>
  );
};

export const getHeader = (
  header: string | undefined,
  classes: ReturnType<typeof useCardHeaderStyle>,
): JSX.Element | null => {
  if (isUndefined(header)) return null;
  return (
    <div className={classes.header}>{header}</div>
  );
};

export type ItemData<T extends {}> = {
  label: string;
  value: T[keyof T];
};

export const getItem = <T extends {}>(
  data: T[keyof T],
  header: string,
  classes: ReturnType<typeof useCardItemStyle>,
): JSX.Element | null => {
  if (isNull(data)) return null;
  return (
    <div className={classes.item}>
      <div className={classes.subHeader}>{header}</div>
      <div>{dataToMessage(data)}</div>
    </div>
  );
};


export type ButtonData = {
  variant?: ButtonVariant;
  classType?: CssClassType<typeof useButtonStyle>;
  label?: ButtonMessage;
  onClick: OnClickType;
};

export const getButton = (
  onClick: OnClickType,
  variant: ButtonVariant = ButtonVariant.contained,
  classType: CssClassType<typeof useButtonStyle> | undefined = undefined,
  label: ButtonMessage = ButtonMessage.Confirm,
): JSX.Element => (
  <Button variant={variant} className={classType} onClick={onClick}>{label}</Button>
);
