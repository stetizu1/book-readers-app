import React, { FC, ReactElement } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';

import { Format } from 'book-app-shared/types/enums/Format';
import { isNull, isString, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isEmptyString } from 'book-app-shared/helpers/validators';

import { OtherMessage } from 'app/messages/OtherMessage';

import { OnChangeSelect } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,

} from 'app/components/blocks/card-items/items-form/types';
import { getFormItemSkeleton } from 'app/components/blocks/card-items/items-form/getFormItemSkeleton';

import { useSelectFormItemStyle } from '../useSelectFormItemStyle';


type ValueType = Format | null;

type Option = {
  name: string;
  value: Format;
};

type WithOptions = {
  options: Option[];
};


type Props = FormProps<ValueType> & WithOptions;

export type EditableData = ItemEditableData<ValueType> & WithOptions;
export type ReadOnlyData = ItemReadonlyData<ValueType> & WithOptions;


const BaseSelectFormItem: FC<Props> = (props) => {
  const classes = useSelectFormItemStyle();
  const {
    options,
    label, value, required, readOnly, updateValueFunction,
  } = props;

  const onChange: OnChangeSelect = (event): void => {
    if (!isUndefined(updateValueFunction)) {
      const eventValue = event.target.value;
      if (isString(eventValue) && isEmptyString(eventValue)) {
        updateValueFunction(null);
        return;
      }
      updateValueFunction(eventValue as Format);
    }
  };
  const standardizedValue = isNull(value) ? undefined : value;
  return (
    <FormControl variant="outlined" className={classes.selectContainer}>
      <InputLabel>{label}</InputLabel>
      <Select
        className={classes.select}
        native
        value={standardizedValue}
        onChange={onChange}
        label={label}
        required={required}
        readOnly={readOnly}
      >
        {!required && (
          <option value={undefined}>{OtherMessage.emptyOption}</option>
        )}
        {options?.map((option) => (
          <option key={option.name} value={option.value}>{option.name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export const getFormatSelectNullableFormItem = (data: EditableData | ReadOnlyData, defaultValue: Format | null = null): ReactElement<Props> => (
  getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
    BaseSelectFormItem,
    defaultValue,
  )(data)
);
