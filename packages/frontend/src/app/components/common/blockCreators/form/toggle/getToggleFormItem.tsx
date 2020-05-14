import React, { FC } from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';

import { OnChangeToggle } from 'app/types/EventTypes';

import { changeIfDefined } from 'app/helpers/form/changeIfDefined';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,
} from 'app/components/common/blockCreators/form/types';
import { getFormItemSkeleton } from 'app/components/common/blockCreators/form/getFormItemSkeleton';

import { useToggleFormItemStyle } from './useToggleFormItemStyle';


type ValueType = boolean;

type EditableData = ItemEditableData<ValueType>;
type ReadonlyData = ItemReadonlyData<ValueType>;
type Props = FormProps<ValueType>;

const BaseToggleFormItem: FC<Props> = (props) => {
  const classes = useToggleFormItemStyle();

  const {
    label, value, required, readOnly, updateValueFunction,
  } = props;

  const onChange: OnChangeToggle = (event) => changeIfDefined(updateValueFunction, event.target.checked);

  return (
    <FormControlLabel
      label={label}
      control={(
        <Switch
          readOnly={readOnly}
          className={classes.switch}
          required={required}
          checked={value}
          onChange={onChange}
        />
      )}
    />
  );
};

export const getToggleFormItem = getFormItemSkeleton<ValueType, Props, ReadonlyData, EditableData>(
  BaseToggleFormItem,
  false,
  true,
);
