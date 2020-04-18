import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';

import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';
import { createPersonalBookDataFromDbRow } from '../db/transformations/personalBookDataTransformation';
import { checkPersonalBookDataCreate } from '../checks/personalBookDataCheck';


interface PersonalBookDataRepository extends Repository {
  createPersonalBookData: CreateActionWithContext<PersonalBookData>;
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
};
