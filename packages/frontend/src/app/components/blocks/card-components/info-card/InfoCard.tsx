import React, { FC } from 'react';
import { Paper } from '@material-ui/core';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';

import { getButtonsLayout } from '../../card-layout/buttons/getButtonsLayout';
import { DescriptionComponentType } from '../../card-layout/body/description/getDescription';
import { HeaderComponentType } from '../../card-layout/header/getCardHeader';
import { useInfoCardStyle } from './useInfoCardStyle';


export interface InfoCardData {
  header: HeaderComponentType;
  description: DescriptionComponentType;
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: InfoCardData;
}

type Props = InputProps;

export const InfoCard: FC<Props> = (props) => {
  const classes = useInfoCardStyle();

  const {
    header,
    description,
    buttons = [],
  } = props.data;

  return (
    <Paper className={classes.paper}>
      {header}
      {description}
      {getButtonsLayout(buttons)}
    </Paper>
  );
};
