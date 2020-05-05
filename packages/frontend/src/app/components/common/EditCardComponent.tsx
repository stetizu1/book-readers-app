import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { composeClasses } from 'app/helpers/style/composeClasses';

import {
  ButtonData,
  getButton, getHeader, getImage, getEditItem, AllEditData,
} from 'app/components/common/getCardElement';

import { useCardStyle } from './styles/CardStyle';
import { useCardItemStyle } from './styles/CardItemStyle';
import { useImageCardStyle } from './styles/ImageCardStyle';
import { useCardHeaderStyle } from './styles/CardHeaderStyle';
import { useCardColorStyle } from './styles/CardColorStyle';
import { useButtonStyle } from './styles/ButtonsStyle';


export interface EditCardData<T extends {}> {
  image?: SvgIconComponent;
  header?: string;
  items: AllEditData<T>[];
  buttons: ButtonData[];
}

interface InputProps<T extends {}> {
  data: EditCardData<T>;
}

type Props<T> = InputProps<T>;

export const EditCardComponent = <T extends {}>(props: Props<T>): JSX.Element => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();
  const headerClasses = useCardHeaderStyle();
  const itemClasses = useCardItemStyle();
  const imageClasses = useImageCardStyle();
  const buttonClasses = useButtonStyle();
  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          <Grid container>
            {getImage(props.data.image, imageClasses)}
            <Grid item xs={12} sm container className={cardClasses.inside}>
              <Grid item xs>
                {getHeader(props.data.header, headerClasses)}
                <form autoComplete="off">
                  {props.data.items.map((data) => (
                    getEditItem<T>(data, itemClasses)
                  ))}
                </form>
              </Grid>
            </Grid>
          </Grid>
          <div className={buttonClasses.containerMultiple}>
            {props.data.buttons.map((buttonData) => (
              getButton(buttonData.onClick, buttonData.variant, buttonData.classType, buttonData.label)
            ))}
          </div>
        </Grid>
      </Paper>
    </div>
  );
};
