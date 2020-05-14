import React, { FC } from 'react';
import { Grid, Paper } from '@material-ui/core';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-items/getHeader';
import { TextComponentType } from 'app/components/blocks/card-items/getText';
import { ImageComponentType } from 'app/components/blocks/card-items/getImage';

import { useCardStyle } from 'app/components/blocks/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/blocks/styles/cardItems/CardColorStyle';
import { useButtonsOverlayStyle } from 'app/components/blocks/styles/buttons/ButtonsOverlayStyle';
import { Items } from 'app/components/blocks/Items';


export interface CardData {
  image?: ImageComponentType;
  header?: HeaderComponentType;
  text?: TextComponentType;
  items?: {
    left?: {
      top?: JSX.Element[];
      bottom?: JSX.Element[];
    };
    right?: {
      top?: JSX.Element[];
      bottom?: JSX.Element[];
    };
  };
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: CardData;
}

type Props = InputProps;

export const CardComponent: FC<Props> = (props) => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const buttonsOverlayClasses = useButtonsOverlayStyle();

  const {
    header = null,
    text = null,
    image = null,
    items,
    buttons = [],
  } = props.data;

  const topLeftItems = items?.left?.top || [];
  const bottomLeftItems = items?.left?.bottom || [];
  const topRightItems = items?.right?.top || [];
  const bottomRightItems = items?.right?.bottom || [];

  const isRenderedLeft = !!topLeftItems.length || !!bottomLeftItems.length;
  const isRenderedRight = !!topRightItems.length || !!bottomRightItems.length;

  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {image}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              {header}
              {text}
              <div>
                {isRenderedLeft && (
                  <Grid item xs className={cardClasses.left}>
                    <Items items={topLeftItems} isLeft isTop />
                    <Items items={bottomLeftItems} isLeft isTop={false} />
                  </Grid>
                )}
                {isRenderedRight && (
                  <Grid item xs className={cardClasses.right}>
                    <Items items={topRightItems} isLeft={false} isTop />
                    <Items items={bottomRightItems} isLeft={false} isTop={false} />
                  </Grid>
                )}
              </div>
            </Grid>
          </Grid>
          <div className={buttonsOverlayClasses.multiple}>
            {buttons.map((buttonType, index) => (
              <div key={`${buttonType.props.label}-${index}`}>
                {buttonType}
              </div>
            ))}
          </div>
        </Grid>
      </Paper>
    </div>
  );
};
