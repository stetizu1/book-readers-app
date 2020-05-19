import React from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { Card, CardData } from '../card/Card';
import { useCardsStyle } from './useCardsStyle';


export interface CardsData<T> {
  data: T[];
  getCardData: (data: T) => CardData;
  getKey: (data: T) => string;
}

const nothingMessage = PageMessages.nothing;

export const Cards = <T extends {}>({ data, getCardData, getKey }: CardsData<T>): JSX.Element => {
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
        <Card data={getCardData(value)} key={getKey(value)} />
      ))}
    </>
  );
};
