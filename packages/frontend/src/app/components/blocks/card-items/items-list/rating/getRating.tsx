import React, { FC } from 'react';
import Rating from '@material-ui/lab/Rating';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

interface RatingData {
  value: number | undefined | null;
}

const BaseRating: FC<RatingData> = ({ value }) => {
  if (isUndefined.or(isNull)(value)) return null;
  return (
    <Rating
      value={value}
      readOnly
    />
  );
};

export const getRating = (stars: number | undefined | null): JSX.Element => (
  <BaseRating value={stars} />
);
