import React, { ReactElement } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeSelect } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,

} from 'app/components/common/blockCreators/form/types';
import { getFormItemSkeleton } from 'app/components/common/blockCreators/form/getFormItemSkeleton';
import { useSelectFormItemStyle } from './useSelectFormItemStyle';


type SelectTypes = string | number | string[];
type ValueType<T extends SelectTypes> = T | undefined;

type Option<T> = {
  name: string;
  value: T;
};

type WithOptions<T extends SelectTypes> = {
  options: Option<T>[];
  convert: (value: unknown) => T;
};


type Props<T extends SelectTypes> = FormProps<ValueType<T>> & WithOptions<T>;

export type EditableData<T extends SelectTypes> = ItemEditableData<ValueType<T>> & WithOptions<T>;
export type ReadOnlyData<T extends SelectTypes> = ItemReadonlyData<ValueType<T>> & WithOptions<T>;


const BaseSelectFormItem = <T extends SelectTypes>(props: Props<T>): JSX.Element => {
  const classes = useSelectFormItemStyle();
  const {
    label, value, required, readOnly, options, updateValueFunction, convert,
  } = props;

  const onChange: OnChangeSelect | undefined = !isUndefined(updateValueFunction) ? (event): void => {
    updateValueFunction(convert(event.target.value));
  } : undefined;
  return (
    <FormControl variant="outlined" className={classes.selectContainer}>
      <InputLabel>{label}</InputLabel>
      <Select
        className={classes.select}
        native
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        readOnly={readOnly}
      >
        {!required && (
          <option aria-label="None" value={undefined} />
        )}
        {options?.map((option) => (
          <option key={option.name} value={option.value}>{option.name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export const getSelectFormItem = <T extends SelectTypes>(data: EditableData<T> | ReadOnlyData<T>, defaultValue?: T): ReactElement<Props<T>> => (
  getFormItemSkeleton<ValueType<T>, Props<T>, ReadOnlyData<T>, EditableData<T>>(
    BaseSelectFormItem,
    defaultValue,
  )(data)
);
