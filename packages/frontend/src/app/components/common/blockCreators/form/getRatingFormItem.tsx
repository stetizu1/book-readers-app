import React, { FC, ReactElement } from 'react';
import { Rating } from '@material-ui/lab';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeWithValue } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormFieldProps,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';


export type RatingItemEditableData = ItemEditableData<number | null>;
export type RatingItemReadonlyData = ItemReadonlyData<number | null>;


type RatingFormProps = FormFieldProps<number | null>;

const BaseRatingFormItem: FC<RatingFormProps> = (props) => {
  const classes = useFormItemStyle();
  const {
    label, value, required, readOnly, updateValue,
  } = props;

  const defaultValue = (required) ? 1 : undefined;

  const onChange: OnChangeWithValue<number | null> = (date, val) => {
    if (!isUndefined(updateValue)) {
      const newValue = (!required || isNull(val)) ? val : 1;
      updateValue(newValue);
    }
  };
  return (
    <div className={classes.item}>
      <div>{label}</div>
      <Rating
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
};

export type RatingFormItemType = ReactElement<RatingFormProps>;

export const getRatingFormItem = (
  data: RatingItemEditableData | RatingItemReadonlyData,
): RatingFormItemType => {
  const {
    label,
  } = data;
  const value = normalizeValue(data.value, null);
  if (isReadOnlyData(data)) {
    return (
      <BaseRatingFormItem readOnly value={value} label={label} required={false} updateValue={undefined} />
    );
  }
  const {
    required = false,
    updateValueFunction,
  } = data;
  return (
    <BaseRatingFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      updateValue={updateValueFunction}
    />
  );
};
