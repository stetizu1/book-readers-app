import React, { FC, ReactElement } from 'react';
import { Star, StarBorder } from '@material-ui/icons';

import { starsCount } from 'book-app-shared/constants/Stars';

import { repeat } from 'app/helpers/repeat';

import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';


export type StarsData = {
  stars: number;
};

const BaseStars: FC<StarsData> = ({ stars }) => {
  const classes = useCardItemStyle();
  return (
    <div className={classes.item}>
      {repeat(Star, stars)}
      {repeat(StarBorder, starsCount.max - stars)}
    </div>
  );
};

export type StarsComponentType = ReactElement<StarsData>;

export const getStars = (stars: number): StarsComponentType => (
  <BaseStars stars={stars} />
);
