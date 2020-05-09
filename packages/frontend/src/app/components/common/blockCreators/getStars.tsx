import React, { FC, ReactElement } from 'react';
import { Star, StarBorder } from '@material-ui/icons';

import { starsCount } from 'book-app-shared/constants/Stars';

import { repeat } from 'app/helpers/repeat';

import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { composeClasses } from 'app/helpers/style/composeClasses';


export type StarsData = {
  stars: number | null | undefined;
};

const BaseStars: FC<StarsData> = ({ stars }) => {
  const classes = useCardItemStyle();
  if (isUndefined.or(isNull)(stars)) return null;
  return (
    <div className={composeClasses(classes.item, classes.shifted)}>
      {repeat(Star, stars)}
      {repeat(StarBorder, starsCount.max - stars)}
    </div>
  );
};

export type StarsComponentType = ReactElement<StarsData>;

export const getStars = (stars: number | undefined | null): StarsComponentType => (
  <BaseStars stars={stars} />
);
