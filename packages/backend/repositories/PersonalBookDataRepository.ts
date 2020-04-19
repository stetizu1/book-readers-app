import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, UpdateActionWithContext } from '../types/actionTypes';
import {
  getErrorPrefixAndPostfix, constructDeleteMessage,
  ErrorMethod,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { merge } from '../helpers/db/merge';

import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';
import {
  createPersonalBookDataFromDbRow,
  transformPersonalBookDataUpdateFromPersonalBookData,
} from '../db/transformations/personalBookDataTransformation';
import { checkPersonalBookDataCreate, checkPersonalBookDataUpdate } from '../checks/personalBookDataCheck';


interface PersonalBookDataRepository extends Repository {
  createPersonalBookData: CreateActionWithContext<PersonalBookData>;
  readPersonalBookDataByBookDataId: ReadActionWithContext<PersonalBookData>;
  updatePersonalBookData: UpdateActionWithContext<PersonalBookData | string>;
}

export const personalBookDataRepository: PersonalBookDataRepository = {
  name: 'PersonalBookData',

  createPersonalBookData: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(personalBookDataRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkPersonalBookDataCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(personalBookDataQueries.createPersonalBookData, stringifyParams(checked.bookDataId, checked.dateRead, checked.comment));
      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readPersonalBookDataByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(personalBookDataRepository.name, ErrorMethod.Read, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(personalBookDataQueries.getPersonalBookDataByBookDataId, stringifyParams(bookDataId));
      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updatePersonalBookData: async (context, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(personalBookDataRepository.name, ErrorMethod.Update, bookDataId, body);

    const { checked, checkError } = checkPersonalBookDataUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await personalBookDataRepository.readPersonalBookDataByBookDataId(context, bookDataId);
      const currentData = transformPersonalBookDataUpdateFromPersonalBookData(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, dateRead } = mergedUpdateData;

      if (comment === null && dateRead === null) {
        await context.transaction.executeSingleOrNoResultQuery(
          personalBookDataQueries.deletePersonalBookData,
          stringifyParams(bookDataId),
        );
        return constructDeleteMessage(personalBookDataRepository.name, bookDataId);
      }

      const row = await context.transaction.executeSingleResultQuery(
        personalBookDataQueries.updatePersonalBookData,
        stringifyParams(bookDataId, dateRead, comment),
      );

      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
