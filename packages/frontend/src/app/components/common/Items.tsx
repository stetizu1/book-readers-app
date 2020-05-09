import React, { FC } from 'react';
import { Grid } from '@material-ui/core';

import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';


interface ItemsProps {
  isLeft: boolean;
  isTop: boolean;
  items?: JSX.Element[];
}

export const Items: FC<ItemsProps> = (props) => {
  const classes = useCardStyle();
  const {
    isLeft,
    isTop,
    items = [],
  } = props;

  return (
    <Grid item xs className={isLeft ? classes.left : classes.right}>
      <div className={isTop ? classes.top : classes.bottom}>
        {items.map((data, index) => (
          <div key={`${data.props.label}-${index}`}>
            {data}
          </div>
        ))}
      </div>
    </Grid>
  );
};
