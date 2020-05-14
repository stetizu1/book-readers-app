import React, { ComponentType, ReactElement } from 'react';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';
import {
  FormProps,
  ItemReadonlyData,
  ItemEditableData,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { composeClasses } from 'app/helpers/style/composeClasses';

const BaseFormItem = <T, TProps extends FormProps<T>>(props: TProps & { BaseComponent: ComponentType<any> }): JSX.Element => {
  const classes = useFormItemStyle();
  const { BaseComponent, ...rest } = props;
  const restTyped = rest as unknown as TProps;

  const itemClasses = props.readOnly ? composeClasses(classes.item, classes.readOnly) : classes.item;

  return (
    <div className={itemClasses}>
      <BaseComponent {...restTyped} />
    </div>
  );
};


type FormItemType<T, TProps extends FormProps<T>> = ReactElement<TProps>;


export const getFormItemSkeleton = (
  <T, TProps extends FormProps<T>, TReadOnly extends ItemReadonlyData<T>, TEditable extends ItemEditableData<T>>(
    BaseComponent: ComponentType<TProps>, defaultValue: T, defaultRequired = false,
  ) => (
    (data: TEditable | TReadOnly): FormItemType<T, TProps> => {
      const normalizedValue = normalizeValue(data.value, defaultValue);

      if (isReadOnlyData<T, TReadOnly, TEditable>(data)) {
        const {
          readOnly, value, label, ...rest
        } = data;
        return (
          <BaseFormItem
            BaseComponent={BaseComponent}
            label={label}
            value={normalizedValue}
            readOnly
            required={false}
            {...rest}
          />
        );
      }
      const {
        value,
        label,
        required = defaultRequired,
        updateValueFunction,
        ...rest
      } = data;
      return (
        <BaseFormItem
          BaseComponent={BaseComponent}
          value={normalizedValue}
          label={label}
          readOnly={false}
          required={required}
          updateValueFunction={updateValueFunction}
          {...rest}
        />
      );
    }
  )
);
