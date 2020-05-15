import React, { FC } from 'react';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { Check } from '@material-ui/icons';

import { Label } from 'book-app-shared/types/Label';

import { IdMap } from 'app/types/IdMap';
import { OnChangeSelect } from 'app/types/EventTypes';

import { changeIfDefined } from 'app/helpers/form/changeIfDefined';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,

} from 'app/components/blocks/card-items/items-form/types';
import { getLabelItem } from 'app/components/blocks/card-items/items-shared/label-item/getLabelItem';

import { getFormItemSkeleton } from 'app/components/blocks/card-items/items-form/getFormItemSkeleton';
import { useMultiSelectFormItemStyle } from './useMultiSelectFormItemStyle';


type ValueType = number[] | undefined;

type WithLabels = {
  labelMap: IdMap<Label>;
};

type Props = FormProps<ValueType> & WithLabels;
type ReadOnlyData = ItemReadonlyData<ValueType> & WithLabels;
type EditableData = ItemEditableData<ValueType> & WithLabels;

const BaseMultiSelectFormItem: FC<Props> = (props) => {
  const classes = useMultiSelectFormItemStyle();

  const {
    label, value, required, readOnly, labelMap, updateValueFunction,
  } = props;

  const onChange: OnChangeSelect = (event) => changeIfDefined(updateValueFunction, event.target.value as number[]);

  return (
    <FormControl className={classes.multiSelectContainer}>
      <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
      <Select
        className={classes.multiSelect}
        label={label}
        required={required}
        multiple
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        renderValue={(selected): JSX.Element => (
          <>
            {Array.isArray(selected) ? (selected).map((val: number) => (
              getLabelItem(labelMap[val])
            )) : null}
          </>
        )}
      >
        {Object.values(labelMap)?.map((labelValue) => (
          <MenuItem key={labelValue.name} value={labelValue.id}>
            {labelValue.name}
            {value?.some((val) => val === labelValue.id) && <Check className={classes.checkIcon} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};


export const getMultiSelectFormItem = getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
  BaseMultiSelectFormItem,
  undefined,
);
