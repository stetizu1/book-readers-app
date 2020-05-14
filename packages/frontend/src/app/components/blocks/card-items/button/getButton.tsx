import React, { FC, ReactElement } from 'react';
import { Button } from '@material-ui/core';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';

import { ButtonMessage } from 'app/messages/ButtonMessage';

import { OnClickType } from 'app/types/EventTypes';
import { CssClassType } from 'app/types/CssClassType';

import { useButtonStyle } from 'app/components/blocks/card-items/button/ButtonsStyle';


export type ButtonData = {
  variant?: ButtonVariant;
  classType?: CssClassType<typeof useButtonStyle>;
  label?: ButtonMessage;
  onClick: OnClickType;
};

const BaseFormButton: FC<ButtonData> = (
  {
    variant, label, classType, onClick,
  },
) => (
  <Button variant={variant} className={classType} onClick={onClick}>{label}</Button>
);

export type ButtonComponentType = ReactElement<ButtonData>;

export const getButton = (
  data: ButtonData,
): ButtonComponentType => {
  const {
    onClick,
    label = ButtonMessage.Confirm,
    variant = ButtonVariant.contained,
    classType = undefined,
  } = data;
  return <BaseFormButton onClick={onClick} variant={variant} classType={classType} label={label} />;
};
