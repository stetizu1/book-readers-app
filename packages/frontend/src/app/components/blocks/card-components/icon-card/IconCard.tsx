import React, { FC } from 'react';
import { Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { DescriptionComponentType } from '../../card-layout/body/description/getDescription';
import { HeaderComponentType } from '../../card-layout/header/getCardHeader';

import { useIconCardStyle } from './useIconCardStyle';


export interface InfoCardData {
  header: HeaderComponentType;
  description: DescriptionComponentType;
  Icon: SvgIconComponent;
}

interface InputProps {
  data: InfoCardData;
}

type Props = InputProps;

export const IconCard: FC<Props> = ({ data }) => {
  const classes = useIconCardStyle();

  const {
    header,
    description,
    Icon,
  } = data;

  return (
    <Paper className={classes.paper}>
      {header}
      <div className={classes.content}>
        <Icon className={classes.imageLeft} />
        {description}
        <Icon className={classes.imageRight} />
      </div>
    </Paper>
  );
};
