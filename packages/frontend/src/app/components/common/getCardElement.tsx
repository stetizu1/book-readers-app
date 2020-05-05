import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';

import { ButtonMessage } from 'app/messages/ButtonMessage';

import { dataToMessage } from 'app/helpers/dataToMessage';

import { Call } from 'app/types/CallResult';
import { OnClickType } from 'app/types/EventTypes';
import { UpdateValue } from 'app/types/UpdateValue';

import { useImageCardStyle } from './styles/ImageCardStyle';
import { useCardItemStyle } from './styles/CardItemStyle';
import { useCardHeaderStyle } from './styles/CardHeaderStyle';
import { useButtonStyle } from './styles/ButtonsStyle';


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

export enum InputType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
}

interface ItemEditData<T extends {}> extends ItemData<T> {
  inputType: InputType;
  regexp?: RegExp;
  required?: boolean;
  readOnly?: boolean;
}

export interface TextItemEditData<T extends {}> extends ItemEditData<T> {
  inputType: InputType.text;
  updateValue?: UpdateValue<string>;
}

export interface BooleanItemEditData<T extends {}> extends ItemEditData<T> {
  inputType: InputType.boolean;
  updateValue?: UpdateValue<boolean>;
}

export type AllEditData<T extends {}> = TextItemEditData<T> | BooleanItemEditData<T>;

export const getItem = <T extends {}>(
  data: T[keyof T],
  label: string,
  classes: ReturnType<typeof useCardItemStyle>,
): JSX.Element | null => {
  if (isNull(data)) return null;
  return (
    <div className={classes.item}>
      <div className={classes.subHeader}>{label}</div>
      <div>{dataToMessage(data)}</div>
    </div>
  );
};

const getTextEditItem = <T extends {}>(
  data: TextItemEditData<T>,
  classes: ReturnType<typeof useCardItemStyle>,
): JSX.Element => {
  const {
    label,
    value,
    updateValue,
    regexp,
    required = false,
    readOnly = false,
  } = data;

  return (
    <div className={classes.item}>
      <TextField
        variant="outlined"
        label={label}
        value={value}
        required={required}
        disabled={readOnly}
        inputProps={{ pattern: regexp }}
        onChange={(event): void => {
          if (!isUndefined(updateValue)) updateValue(event.target.value);
        }}
      />
    </div>
  );
};

export const getEditItem = <T extends {}>(
  data: AllEditData<T>,
  classes: ReturnType<typeof useCardItemStyle>,
): JSX.Element | null => {
  if (isNull(data)) return null;
  switch (data.inputType) {
    case InputType.text:
      return getTextEditItem(data, classes);
    default:
      return null;
  }
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
