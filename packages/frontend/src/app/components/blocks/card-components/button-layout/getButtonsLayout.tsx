import React, { FC, Fragment } from 'react';

import { ButtonLayoutType } from 'app/constants/style/ButtonLayoutType';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';

import { useButtonsLayoutStyle } from './useButtonsLayoutStyle';


type ButtonLayoutData = {
  buttons: ButtonComponentType[];
  buttonLayoutType: ButtonLayoutType;
};

const BaseButtonsOverlay: FC<ButtonLayoutData> = ({ buttons, buttonLayoutType }) => {
  const classes = useButtonsLayoutStyle();

  return (
    <div className={classes[buttonLayoutType]}>
      {buttons.map((button) => (
        <Fragment key={`${button.props.label}-${button.props.buttonType}`}>
          {button}
        </Fragment>
      ))}
    </div>
  );
};


export const getButtonsLayout = (
  buttons: ButtonComponentType[],
  buttonLayoutType?: ButtonLayoutType,
): JSX.Element => (
  <BaseButtonsOverlay
    buttons={buttons}
    buttonLayoutType={buttonLayoutType || ButtonLayoutType.adjacent}
  />
);
