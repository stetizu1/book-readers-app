import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { ButtonComponentType } from 'app/components/common/blockCreators/getButton';
import { HeaderComponentType } from 'app/components/common/blockCreators/getHeader';
import { TextComponentType } from 'app/components/common/blockCreators/getText';
import { ImageComponentType } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/common/styles/cardItems/CardColorStyle';
import { useButtonsOverlayStyle } from 'app/components/common/styles/buttons/ButtonsOverlayStyle';


export interface CardData {
  image?: ImageComponentType;
  header?: HeaderComponentType;
  text?: TextComponentType;
  topLeftItems?: JSX.Element[];
  bottomLeftItems?: JSX.Element[];
  topRightItems?: JSX.Element[];
  bottomRightItems?: JSX.Element[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: CardData;
}

type Props = InputProps;

export const CardComponent = (props: Props): JSX.Element => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const buttonsOverlayClasses = useButtonsOverlayStyle();

  const {
    header = null,
    text = null,
    image = null,
    topLeftItems = [],
    bottomLeftItems = [],
    topRightItems = [],
    bottomRightItems = [],
    buttons = [],
  } = props.data;

  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {image}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              <Grid item xs className={cardClasses.left}>
                {header}
                {text}
                <div>
                  {topLeftItems.map((data, index) => (
                    <div key={`${data.props.label}-${index}`}>
                      {data}
                    </div>
                  ))}
                </div>
                {bottomLeftItems.length > 0 && (
                  <div className={cardClasses.bottom}>
                    {bottomLeftItems.map((data, index) => (
                      <div key={`${data.props.label}-${index}`}>
                        {data}
                      </div>
                    ))}
                  </div>
                )}
              </Grid>
              {(topRightItems.length > 0 || bottomRightItems.length > 0)
              && (
                <Grid item xs className={cardClasses.right}>
                  <div>
                    {topRightItems.map((data, index) => (
                      <div key={`${data.props.label}-${index}`}>
                        {data}
                      </div>
                    ))}
                  </div>
                  {bottomRightItems.length > 0 && (
                    <div className={cardClasses.bottom}>
                      {bottomRightItems.map((data, index) => (
                        <div key={`${data.props.label}-${index}`}>
                          {data}
                        </div>
                      ))}
                    </div>
                  )}
                </Grid>
              )}
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
