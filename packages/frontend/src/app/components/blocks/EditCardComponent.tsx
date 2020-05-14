import React, { FC, ReactElement } from 'react';
import { Grid, Paper } from '@material-ui/core';

import { composeClasses } from 'app/helpers/style/composeClasses';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-components/header/getHeader';

import { useCardStyle } from 'app/components/blocks/styles/cardItems/CardStyle';
import { useCardColorStyle } from 'app/components/blocks/styles/cardItems/CardColorStyle';
import { getButtonsLayout } from './card-components/button-layout/getButtonsLayout';


export interface EditCardData {
  header?: HeaderComponentType;
  items?: ReactElement[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps;

export const EditCardComponent: FC<Props> = (props) => {
  const cardClasses = useCardStyle();
  const cardColorClasses = useCardColorStyle();

  const {
    header = null,
    items = [],
    buttons = [],
  } = props.data;

  return (
    <div className={cardClasses.container}>
      <Paper className={composeClasses(cardClasses.paper, cardColorClasses.box)}>
        <Grid container className={cardClasses.gridContainer}>
          {header}
          <Grid container>
            <Grid item xs={12} sm container className={cardClasses.inside}>
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
          {getButtonsLayout(buttons)}
        </Grid>
      </Paper>
    </div>
  );
};
