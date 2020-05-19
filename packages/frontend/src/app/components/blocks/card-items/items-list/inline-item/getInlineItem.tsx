import React, { ReactElement } from 'react';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { SpecialCharacters } from 'app/constants/SpecialCharacters';

import { dataToMessage } from 'app/helpers/dataToMessage';
import { useInlineItemStyle } from './getInlineItemStyle';


export type ItemData<T, > = {
  label: string;
  value: T;
};

const BaseInlineItem = <T, >({ label, value }: ItemData<T>): JSX.Element | null => {
  const classes = useInlineItemStyle();
  if (isUndefined.or(isNull)(value)) return null;
  return (
    <div className={classes.inlineItem}>
      {label}
      :
      {SpecialCharacters.noBreakSpace}
      {dataToMessage(value)}
    </div>
  );
};

export type CardItemComponentType<T> = ReactElement<ItemData<T>>;

export const getInlineItem = <T, >(data: ItemData<T>): CardItemComponentType<T> => (
  <BaseInlineItem label={data.label} value={data.value} />
);
