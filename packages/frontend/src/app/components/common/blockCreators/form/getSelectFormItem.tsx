import React, { ReactElement } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeSelect } from 'app/types/EventTypes';

import { composeClasses } from 'app/helpers/style/composeClasses';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormFieldProps,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';


type SelectTypes = string | number | string[];

type Option<T extends SelectTypes> = {
  name: string;
  value: T;
};

type WithOptions<T extends SelectTypes> = {
  options: Option<T>[];
  convert: (value: unknown) => T;
};

export type SelectItemEditableData<T extends SelectTypes> = ItemEditableData<T | undefined> & WithOptions<T>;
export type SelectItemReadonlyData<T extends SelectTypes> = ItemReadonlyData<T | undefined> & WithOptions<T>;


type SelectFormProps<T extends SelectTypes> = FormFieldProps<T | undefined> & WithOptions<T>;

const BaseSelectFormItem = <T extends SelectTypes>(props: SelectFormProps<T>): JSX.Element => {
  const classes = useFormItemStyle();
  const {
    label, value, required, readOnly, options, updateValue, convert,
  } = props;

  const onChange: OnChangeSelect | undefined = !isUndefined(updateValue) ? (event): void => {
    updateValue(convert(event.target.value));
  } : undefined;
  const classNames = (readOnly) ? composeClasses(classes.item, classes.readOnly) : classes.item;
  return (
    <div className={classNames}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-age-native-simple">{label}</InputLabel>
        <Select
          className={classes.select}
          native
          value={value}
          onChange={onChange}
          label={label}
          required={required}
          readOnly={readOnly}
          inputProps={{
            name: label,
            id: 'outlined-age-native-simple',
          }}
        >
          {!required && (
            <option aria-label="None" value={undefined} />
          )}
          {options?.map((option) => (
            <option key={option.name} value={option.value}>{option.name}</option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export type SelectFormItemType<T extends SelectTypes> = ReactElement<SelectFormProps<T>>;


export const getSelectFormItem = <T extends SelectTypes>(
  data: SelectItemEditableData<T> | SelectItemReadonlyData<T>,
  defaultValue?: T,
): SelectFormItemType<T> => {
  const { label, options, convert } = data;
  const value = normalizeValue(data.value, defaultValue);
  if (isReadOnlyData(data)) {
    return (
      <BaseSelectFormItem
        readOnly
        value={value}
        label={label}
        required={false}
        updateValue={undefined}
        options={options}
        convert={convert}
      />
    );
  }
  const {
    required = false,
    updateValueFunction,
  } = data;
  return (
    <BaseSelectFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      options={options}
      updateValue={updateValueFunction}
      convert={convert}
    />
  );
};
