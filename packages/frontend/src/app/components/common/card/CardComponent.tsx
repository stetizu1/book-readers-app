import React from 'react';
import { Button, Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { dataToMessage } from '../../../helpers/dataToMessage';

import { useCardStyle } from './CardComponentStyle';
import { useButtonStyle } from '../ButtonsStyle';
import { ButtonMessage } from '../../../messages/ButtonMessage';
import { ButtonVariant } from '../../../constants/css/ButtonVariant';


type ButtonClassType = ReturnType<typeof useButtonStyle>[keyof ReturnType<typeof useButtonStyle>];

export interface CardData<T extends {}> {
  image?: SvgIconComponent;
  header?: string;
  items: {
    label: string;
    value: T[keyof T];
  }[];
  buttons: {
    variant?: ButtonVariant;
    classType?: ButtonClassType;
    label: ButtonMessage;
  }[];
}

interface InputProps<T extends {}> {
  data: CardData<T>;
}

type Props<T> = InputProps<T>;

const getImage = (
  IconImage: SvgIconComponent | undefined,
  classes: ReturnType<typeof useCardStyle>,
): JSX.Element | null => {
  if (isUndefined(IconImage)) return null;
  return (
    <Grid item className={classes.image}>
      <IconImage fontSize="inherit" />
    </Grid>
  );
};

const getHeader = (
  header: string | undefined,
  classes: ReturnType<typeof useCardStyle>,
): JSX.Element | null => {
  if (isUndefined(header)) return null;
  return (
    <div className={classes.header}>{header}</div>
  );
};

const getItem = <T extends {}>(
  data: T[keyof T],
  header: string,
  classes: ReturnType<typeof useCardStyle>,
): JSX.Element | null => {
  if (isNull(data)) return null;
  return (
    <div className={classes.item}>
      <div className={classes.subHeader}>{header}</div>
      <div>{dataToMessage(data)}</div>
    </div>
  );
};

const getButton = (
  variant: 'text' | 'outlined' | 'contained' | undefined,
  classType: ButtonClassType | undefined,
  label: string,
): JSX.Element => (
  <Button variant={variant} className={classType}>{label}</Button>
);

export const CardComponent = <T extends {}>(props: Props<T>): JSX.Element => {
  const classes = useCardStyle();
  return (
    <>
      <Paper className={classes.paper}>
        <Grid container>
          {getImage(props.data.image, classes)}
          <Grid item xs={12} sm container className={classes.inside}>
            <Grid item xs>
              {getHeader(props.data.header, classes)}
              {props.data.items.map((data) => (
                getItem<T>(data.value, data.label, classes)
              ))}
            </Grid>
          </Grid>
        </Grid>
        {props.data.buttons.map((buttonData) => (
          getButton(buttonData.variant, buttonData.classType, buttonData.label)
        ))}
      </Paper>
    </>
  );
};
