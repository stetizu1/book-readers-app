import React from 'react';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PageMessages } from 'app/messages/PageMessages';

import { ButtonComponentType } from '../card-items/button/getButton';
import { HeaderComponentType } from '../card-layout/header/getCardHeader';
import { getButtonsLayout } from '../card-layout/buttons/getButtonsLayout';

import { useEmptyComponentStyle } from './useEmptyComponentStyle';


export interface CardsData<T> {
  message?: string;
  button?: ButtonComponentType;
  header?: HeaderComponentType;
}

const nothingMessage = PageMessages.nothing;

export const EmptyComponent = <T extends {}>({ message, button, header }: CardsData<T>): JSX.Element => {
  const classes = useEmptyComponentStyle();
  const buttonsLayout = !isUndefined(button) ? (
    getButtonsLayout([button])
  ) : null;

  return (
    <div className={classes.box}>
      <div className={classes.nothing}>
        {header}
        <div className={classes.message}>{message || nothingMessage}</div>
        {buttonsLayout}
      </div>
    </div>
  );
};
