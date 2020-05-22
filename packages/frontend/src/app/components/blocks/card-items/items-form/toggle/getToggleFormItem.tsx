import React, { FC } from 'react';
import { FormControlLabel, Switch, Tooltip } from '@material-ui/core';

import { OnChangeToggle } from 'app/types/EventTypes';

import { changeIfDefined } from 'app/helpers/form/changeIfDefined';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,
} from 'app/components/blocks/card-items/items-form/types';
import { getFormItemSkeleton } from 'app/components/blocks/card-items/items-form/getFormItemSkeleton';

import { useToggleFormItemStyle } from './useToggleFormItemStyle';


type ValueType = boolean;

type WithTooltip = {
  tooltip?: string;
};

type Props = FormProps<ValueType> & WithTooltip;
type ReadOnlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType> & WithTooltip;

const BaseToggleFormItem: FC<Props> = (props) => {
  const classes = useToggleFormItemStyle();

  const {
    label, value, readOnly, tooltip,
    updateValueFunction,
  } = props;

  const onChange: OnChangeToggle = (event) => changeIfDefined(updateValueFunction, event.target.checked);

  const toggle = (
    <FormControlLabel
      label={label}
      control={(
        <Switch
          readOnly={readOnly}
          className={classes.switch}
          required={false}
          checked={value}
          onChange={onChange}
        />
      )}
    />
  );

  return (
    <Tooltip title={<span className={classes.tooltip}>{tooltip}</span>}>
      {toggle}
    </Tooltip>
  );
};

export const getToggleFormItem = getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
  BaseToggleFormItem,
  false,
  true,
);
