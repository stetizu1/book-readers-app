import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';

import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';
import { createPersonalBookDataFromDbRow } from '../db/transformations/personalBookDataTransformation';
import { checkPersonalBookDataCreate } from '../checks/personalBookDataCheck';


interface PersonalBookDataRepository extends Repository {
  createPersonalBookData: CreateActionWithContext<PersonalBookData>;
  readPersonalBookDataByBookDataId: ReadActionWithContext<PersonalBookData>;
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
};
