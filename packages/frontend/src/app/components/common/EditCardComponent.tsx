import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { FormItemType } from 'app/components/common/blockCreators/form/types';
import { ButtonData, getButton } from 'app/components/common/blockCreators/getButton';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';

import { useCardStyle } from './styles/CardStyle';
import { useCardColorStyle } from './styles/CardColorStyle';
import { useButtonsOverlayStyle } from './styles/ButtonsOverlayStyle';


export interface EditCardData<T extends {}> {
  image?: SvgIconComponent;
  header?: string;
  items: FormItemType[];
  buttons: ButtonData[];
}

interface InputProps<T extends {}> {
  data: EditCardData<T>;
}

type Props<T> = InputProps<T>;

export const EditCardComponent = <T extends {}>(props: Props<T>): JSX.Element => {
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
            {props.data.buttons.map((buttonData) => (
              <div key={buttonData.label}>
                {getButton(buttonData)}
              </div>
            ))}
          </div>
        </Grid>
      </Paper>
    </div>
  );
};
