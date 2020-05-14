import React, { FC, ReactElement } from 'react';
import { Button } from '@material-ui/core';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ButtonType } from 'app/constants/style/ButtonType';

import { ButtonMessage, DefaultButtonMessage } from 'app/messages/ButtonMessage';

import { OnClickType } from 'app/types/EventTypes';

import { useButtonsStyle } from './useButtonsStyle';


export type ButtonData = {
  buttonType: ButtonType;
  label?: ButtonMessage;
  onClick: OnClickType;
};

const BaseFormButton: FC<Required<ButtonData>> = ({ buttonType, label, onClick }) => {
  const buttonClasses = useButtonsStyle();

  return (
    <Button
      variant={ButtonVariant[buttonType]}
      className={buttonClasses[buttonType]}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export type ButtonComponentType = ReactElement<ButtonData>;

export const getButton = (
  data: ButtonData,
): ButtonComponentType => {
  const {
    onClick,
    buttonType = ButtonType.button,
  } = data;
  const label = data.label || DefaultButtonMessage[buttonType];
  return <BaseFormButton onClick={onClick} buttonType={buttonType} label={label} />;
};
