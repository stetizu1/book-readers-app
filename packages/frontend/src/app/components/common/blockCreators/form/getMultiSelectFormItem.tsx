import React, { ReactElement } from 'react';
import {
  Chip, FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';

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
import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';
import { Label } from 'book-app-shared/types/Label';
import { IdMap } from 'app/types/IdMap';
import { Check } from '@material-ui/icons';


type WithLabels = {
  labelMap: IdMap<Label>;
};

export type MultiSelectItemEditableData = ItemEditableData<number[] | undefined> & WithLabels;
export type MultiSelectItemReadonlyData = ItemReadonlyData<number[] | undefined> & WithLabels;


type MultiSelectFormProps = FormFieldProps<number[] | undefined> & WithLabels;

const BaseMultiSelectFormItem = (props: MultiSelectFormProps): JSX.Element => {
  const classes = useFormItemStyle();
  const cardClasses = useCardItemStyle();

  const {
    label, value, required, readOnly, labelMap, updateValue,
  } = props;

  const onChange: OnChangeSelect | undefined = !isUndefined(updateValue) ? (event): void => {
    updateValue(event.target.value as number[]);
  } : undefined;
  const classNames = (readOnly) ? composeClasses(classes.item, classes.readOnly) : classes.item;
  return (
    <div className={classNames}>
      <FormControl>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          className={composeClasses(classes.select, classes.multiSelect)}
          label={label}
          required={required}
          multiple
          value={value}
          onChange={onChange}
          renderValue={(selected): JSX.Element => (
            <>
              {Array.isArray(selected) ? (selected).map((val: number) => <Chip className={cardClasses.label} key={val} label={labelMap[val].name} />) : null}
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
    </div>
  );
};

export type MultiSelectFormItemType = ReactElement<MultiSelectFormProps>;


export const getMultiSelectFormItem = (
  data: MultiSelectItemEditableData | MultiSelectItemReadonlyData,
): MultiSelectFormItemType => {
  const { label, labelMap } = data;
  const value = normalizeValue(data.value, undefined);
  if (isReadOnlyData(data)) {
    return (
      <BaseMultiSelectFormItem
        readOnly
        value={value}
        label={label}
        required={false}
        updateValue={undefined}
        labelMap={labelMap}
      />
    );
  }
  const {
    required = false,
    updateValueFunction,
  } = data;
  return (
    <BaseMultiSelectFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      labelMap={labelMap}
      updateValue={updateValueFunction}
    />
  );
};
