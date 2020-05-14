import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { UpdateValueFunction } from 'app/types/UpdateValueFunction';


export const changeIfDefined = <T>(updateValueFunction: UpdateValueFunction<T> | undefined, value: T): void => {
  if (!isUndefined(updateValueFunction)) {
    updateValueFunction(value);
  }
};
