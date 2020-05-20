import React from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { GridCard, GridCardData } from '../../card-components/grid-card/GridCard';
import { useCardsStyle } from './useCardsStyle';
import { ButtonComponentType } from '../../card-items/button/getButton';


export interface GridCardsData<T> {
  data: T[];
  getGridCardData: (data: T) => GridCardData;
  getKey: (data: T) => string;
  description?: string;
  button?: ButtonComponentType;
}

const nothingMessage = PageMessages.nothing;

export const GridCards = <T extends {}>(props: GridCardsData<T>): JSX.Element => {
  const classes = useCardsStyle();
  const {
    data, getGridCardData, description, button, getKey,
  } = props;

  if (!data.length) {
    return (
      <>
        <div className={classes.box}>
          <div className={classes.nothing}>
            {description || nothingMessage}
            {button}
          </div>
        </div>
      </>
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
