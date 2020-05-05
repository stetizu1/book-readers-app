import React, { FC, ReactElement } from 'react';
import { SvgIconComponent } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { useImageCardStyle } from 'app/components/common/styles/ImageCardStyle';


export type ImageData = {
  IconImage: SvgIconComponent;
};

const BaseImage: FC<ImageData> = ({ IconImage }) => {
  const classes = useImageCardStyle();
  return (
    <Grid item className={classes.image}>
      <IconImage fontSize="inherit" />
    </Grid>
  );
};

export type ImageComponentType = ReactElement<ImageData>;

export const getImage = (
  IconImage: SvgIconComponent | undefined,
): ImageComponentType | null => {
  if (isUndefined(IconImage)) return null;
  return (
    <BaseImage IconImage={IconImage} />
  );
};
