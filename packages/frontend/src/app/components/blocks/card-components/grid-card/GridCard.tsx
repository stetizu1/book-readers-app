import React, { FC } from 'react';
import { Paper } from '@material-ui/core';

import { PositionType } from 'app/constants/style/types/PositionType';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';

import { getItemsGroup } from 'app/components/blocks/card-layout/body/items-group/getItemsGroup';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useGridStyle } from './useGridStyle';


export interface GridCardData {
  header?: HeaderComponentType;
  buttons?: ButtonComponentType[];

  topLeftItems?: JSX.Element[];
  bottomLeftItems?: JSX.Element[];
  topRightItems?: JSX.Element[];
  bottomRightItems?: JSX.Element[];
}

interface InputProps {
  data: GridCardData;
}

type Props = InputProps;

export const GridCard: FC<Props> = (props) => {
  const classes = useGridStyle();

  const {
    header = null,
    topLeftItems = [],
    topRightItems = [],
    bottomLeftItems = [],
    bottomRightItems = [],
    buttons = [],
  } = props.data;

  const isRenderedLeft = !!topLeftItems.length || !!bottomLeftItems.length;
  const isRenderedRight = !!topRightItems.length || !!bottomRightItems.length;

  return (
    <Paper className={classes.paper}>
      {header}
      <div className={classes.gridContainer}>
        {isRenderedLeft && (
          <div>
            {getItemsGroup(topLeftItems, PositionType.topLeft)}
            {getItemsGroup(bottomLeftItems, PositionType.bottomLeft)}
          </div>
        )}
        {isRenderedRight && (
          <div>
            {getItemsGroup(topRightItems, PositionType.topRight)}
            {getItemsGroup(bottomRightItems, PositionType.bottomRight)}
          </div>
        )}
      </div>
      {getButtonsLayout(buttons)}
    </Paper>
  );
};
