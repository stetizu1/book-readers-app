import React, { FC, ReactElement } from 'react';
import { Button } from '@material-ui/core';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { ButtonMessage, DefaultButtonMessage } from 'app/messages/ButtonMessage';

import { OnClickType } from 'app/types/EventTypes';

import { useButtonsStyle } from './useButtonsStyle';


export type ButtonData = {
  buttonType: ButtonType;
  label?: ButtonMessage | JSX.Element;
  isSubmit?: boolean;
  onClick?: OnClickType;
};

export type Props = {
  buttonType: ButtonType;
  label: ButtonMessage | JSX.Element;
  isSubmit: boolean;
  onClick?: OnClickType;
};

const BaseFormButton: FC<Props> = (props) => {
  const {
    buttonType,
    label,
    isSubmit,
    onClick,
  } = props;
  const buttonClasses = useButtonsStyle();

  return (
    <Button
      variant={ButtonVariant[buttonType]}
      className={buttonClasses[buttonType]}
      onClick={onClick}
      form={isSubmit ? 'form' : undefined}
      type={isSubmit ? 'submit' : 'button'}
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
    isSubmit = false,
  } = data;
  const label = data.label || DefaultButtonMessage[buttonType];
  return <BaseFormButton onClick={onClick} buttonType={buttonType} label={label} isSubmit={isSubmit} />;
};
