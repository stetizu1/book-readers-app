import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { FormItemType } from 'app/components/common/blockCreators/form/types';
import { ButtonComponentType } from 'app/components/common/blockCreators/getButton';
import { HeaderComponentType } from 'app/components/common/blockCreators/getHeader';
import { ImageComponentType } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/common/styles/cardItems/CardColorStyle';
import { useButtonsOverlayStyle } from 'app/components/common/styles/buttons/ButtonsOverlayStyle';


export interface EditCardData {
  image?: ImageComponentType;
  header?: HeaderComponentType;
  items?: FormItemType[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps;

export const EditCardComponent = (props: Props): JSX.Element => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const buttonsOverlayClasses = useButtonsOverlayStyle();

  const {
    image = null,
    header = null,
    items = [],
    buttons = [],
  } = props.data;

  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {image}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              {header}
              <Grid item xs>
                <form autoComplete="off">
                  {items.map((item, index) => (
                    <div key={`${item.props.label}-${index}`}>
                      {item}
                    </div>
                  ))}
                </form>
              </Grid>
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
