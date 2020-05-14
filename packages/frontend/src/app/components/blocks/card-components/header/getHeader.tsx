import React, { FC, ReactElement } from 'react';

import { useCardHeaderStyle } from 'app/components/blocks/card-components/header/useCardHeaderStyle';
import { SvgIconComponent } from '@material-ui/icons';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';


export type HeaderData = {
  header: string;
  ImageComponent?: SvgIconComponent;
};

const BaseHeader: FC<HeaderData> = ({ header, ImageComponent }) => {
  const classes = useCardHeaderStyle();
  return (
    <div className={classes.header}>
      <div className={classes.innerHeader}>
        <span className={classes.text}>{header}</span>
        {
          !isUndefined(ImageComponent)
          && <ImageComponent className={classes.image} />
        }
      </div>
      <hr className={classes.headerLine} />
    </div>
  );
};

export type HeaderComponentType = ReactElement<HeaderData>;

export const getHeader = (header: string, ImageComponent?: SvgIconComponent): HeaderComponentType => (
  <BaseHeader header={header} ImageComponent={ImageComponent} />
);
