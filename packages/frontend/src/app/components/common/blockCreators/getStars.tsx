import React from 'react';
import { getRatingFormItem } from 'app/components/common/blockCreators/form/rating/getRatingFormItem';

export const getStars = (stars: number | undefined | null): JSX.Element => (
  getRatingFormItem({ readOnly: true, value: stars, label: null })
);
