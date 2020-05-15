import React, { FC, ReactElement, Fragment } from 'react';
import { Paper } from '@material-ui/core';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';

import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useFormCardStyle } from './useFormCardStyle';


export interface EditCardData {
  header?: HeaderComponentType;
  items?: ReactElement[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps;

export const FormCard: FC<Props> = (props) => {
  const classes = useFormCardStyle();

  const {
    header = null,
    items = [],
    buttons = [],
  } = props.data;

  return (
    <Paper className={classes.paper}>
      {header}
      <form autoComplete="off" className={classes.content}>
        {items.map((item, index) => (
          <Fragment key={`${item.props.label}-${index}`}>
            {item}
          </Fragment>
        ))}
      </form>
      {getButtonsLayout(buttons)}
    </Paper>
  );
};
