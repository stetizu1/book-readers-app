import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { FormItemType } from 'app/components/common/blockCreators/form/types';
import { ButtonType } from 'app/components/common/blockCreators/getButton';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from 'app/components/common/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/common/styles/cardItems/CardColorStyle';
import { useButtonsOverlayStyle } from 'app/components/common/styles/buttons/ButtonsOverlayStyle';


export interface EditCardData {
  image?: SvgIconComponent;
  header?: string;
  items: FormItemType[];
  buttons: ButtonType[];
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps;

export const EditCardComponent = (props: Props): JSX.Element => {
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
                <form autoComplete="off">
                  {props.data.items.map((item) => (
                    <div key={item.props.label}>
                      {item}
                    </div>
                  ))}
                </form>
              </Grid>
            </Grid>
          </Grid>
          <div className={buttonsOverlayClasses.multiple}>
            {props.data.buttons.map((buttonType) => (
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
