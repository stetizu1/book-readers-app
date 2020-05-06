import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { ButtonType } from 'app/components/common/blockCreators/getButton';
import { getCardItem, ItemData } from 'app/components/common/blockCreators/getCardItem';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getSubHeader } from 'app/components/common/blockCreators/getSubHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/common/styles/cardItems/CardColorStyle';
import { useButtonsOverlayStyle } from 'app/components/common/styles/buttons/ButtonsOverlayStyle';


export interface CardData<T extends {} = {}> {
  image?: SvgIconComponent;
  header?: string;
  subHeader?: string;
  items?: ItemData<T>[];
  buttons?: ButtonType[];
}

interface InputProps<T extends {}> {
  data: CardData<T>;
}

type Props<T> = InputProps<T>;

export const CardComponent = <T extends {}>(props: Props<T>): JSX.Element => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const buttonsOverlayClasses = useButtonsOverlayStyle();

  const {
    header,
    subHeader,
    image,
    items = [],
    buttons = [],
  } = props.data;
  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {getImage(image)}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              <Grid item xs>
                {getHeader(header)}
                {getSubHeader(subHeader)}
                {items.map((data) => (
                  getCardItem<T>(data)
                ))}
              </Grid>
            </Grid>
          </Grid>
          <div className={buttonsOverlayClasses.multiple}>
            {buttons.map((buttonType) => (
              <div key={buttonType.props.label}>
                {buttonType}
              </div>
            ))}
          </div>
        </Grid>
      </Paper>
    </div>
  );
};
