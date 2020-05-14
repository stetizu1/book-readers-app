import React, { FC, ReactElement } from 'react';
import { SvgIconComponent } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

import { useImageCardStyle } from 'app/components/blocks/styles/cardItems/CardImageStyle';


export type ImageData = {
  IconImage: SvgIconComponent;
  large: boolean;
};

const BaseImage: FC<ImageData> = ({ IconImage, large }) => {
  const classes = useImageCardStyle();
  return (
    <Grid item className={large ? classes.imageBig : classes.imageSmall}>
      <IconImage fontSize="inherit" />
    </Grid>
  );
};

export type ImageComponentType = ReactElement<ImageData>;

export const getImage = (IconImage: SvgIconComponent, large = true): ImageComponentType => (
  <BaseImage IconImage={IconImage} large={large} />
);
