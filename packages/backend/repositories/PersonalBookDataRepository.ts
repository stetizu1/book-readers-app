import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

import { PersonalBookDataQueries } from '../db/queries/PersonalBookDataQueries';
import { createPersonalBookDataFromDbRow } from '../db/transformations/personalBookDataTransformation';
import { checkPersonalBookDataCreate } from '../checks/personalBookDataCheck';


export class PersonalBookDataRepository {
  static REPO_NAME = 'PersonalBookData';

  static createPersonalBookData: CreateActionWithContext<PersonalBookData> = async (context, body): Promise<PersonalBookData> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(PersonalBookDataRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkPersonalBookDataCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(PersonalBookDataQueries.createPersonalBookData, stringifyParams(checked.bookDataId, checked.dateRead, checked.comment));
      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
