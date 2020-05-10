import { Dispatch, SetStateAction } from 'react';

const updateState = <TObject, TKey extends keyof TObject>(
  data: TObject, set: Dispatch<SetStateAction<TObject>>, key: TKey, value: TObject[TKey],
): void => {
  set({
    ...data,
    [key]: value,
  });
};

type GetValue<TValue> = (value: TValue) => void;

export const getUpdateValue = <TObject, TKey extends keyof TObject>(data: TObject, set: Dispatch<SetStateAction<TObject>>, key: TKey): GetValue<TObject[TKey]> => (
  (value: TObject[TKey]): void => {
    updateState(data, set, key, value);
  }
);
