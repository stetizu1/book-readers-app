import React from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { GridCard, GridCardData } from '../../card-components/grid-card/GridCard';
import { useCardsStyle } from './useCardsStyle';


export interface GridCardsData<T> {
  data: T[];
  getGridCardData: (data: T) => GridCardData;
  getKey: (data: T) => string;
}

const nothingMessage = PageMessages.nothing;

export const GridCards = <T extends {}>({ data, getGridCardData, getKey }: GridCardsData<T>): JSX.Element => {
  const classes = useCardsStyle();

  if (!data.length) {
    return (
      <div className={classes.box}>
        <div className={classes.nothing}>{nothingMessage}</div>
      </div>
    );
  }

  return (
    <>
      {data.map((value) => (
        <GridCard data={getGridCardData(value)} key={getKey(value)} />
      ))}
    </>
  );
};
