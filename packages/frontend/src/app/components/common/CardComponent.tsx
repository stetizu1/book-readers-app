import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { ButtonData, getButton } from 'app/components/common/blockCreators/getButton';
import { getCardItem, ItemData } from 'app/components/common/blockCreators/getCardItem';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from './styles/CardStyle';
import { useCardColorStyle } from './styles/CardColorStyle';
import { useButtonsOverlayStyle } from './styles/ButtonsOverlayStyle';


export interface CardData<T extends {}> {
  image: SvgIconComponent;
  header?: string;
  items: ItemData<T>[];
  buttons: ButtonData[];
}

interface InputProps<T extends {}> {
  data: CardData<T>;
}

type Props<T> = InputProps<T>;

export const CardComponent = <T extends {}>(props: Props<T>): JSX.Element => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const buttonsOverlayClasses = useButtonsOverlayStyle();

  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {getImage(props.data.image)}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              <Grid item xs>
                {getHeader(props.data.header)}
                {props.data.items.map((data) => (
                  getCardItem<T>(data)
                ))}
              </Grid>
            </Grid>
          </Grid>
          <div className={buttonsOverlayClasses.multiple}>
            {props.data.buttons.map((buttonData) => (
              getButton(buttonData)
            ))}
          </div>
        </Grid>
      </Paper>
    </div>
  );
};
