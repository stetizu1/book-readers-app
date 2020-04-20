import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, UpdateActionWithContext } from '../types/actionTypes';

import { constructDeleteMessage, getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkPersonalBookDataCreate, checkPersonalBookDataUpdate } from '../checks/personalBookDataCheck';
import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';
import {
  createPersonalBookDataFromDbRow,
  transformPersonalBookDataUpdateFromPersonalBookData,
} from '../db/transformations/personalBookDataTransformation';


interface PersonalBookDataRepository extends Repository {
  createPersonalBookData: CreateActionWithContext<PersonalBookData>;
  readPersonalBookDataByBookDataId: ReadActionWithContext<PersonalBookData>;
  updatePersonalBookData: UpdateActionWithContext<PersonalBookData | string>;
}

export const personalBookDataRepository: PersonalBookDataRepository = {
  name: RepositoryName.personalBookData,

  createPersonalBookData: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(personalBookDataRepository.name, body);

    const { checked, checkError } = checkPersonalBookDataCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.executeSingleResultQuery(personalBookDataQueries.createPersonalBookData, stringifyParams(checked.bookDataId, checked.dateRead, checked.comment));
      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readPersonalBookDataByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(personalBookDataRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(personalBookDataQueries.getPersonalBookDataByBookDataId, stringifyParams(bookDataId));
      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updatePersonalBookData: async (context, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(personalBookDataRepository.name, bookDataId, body);

    const { checked, checkError } = checkPersonalBookDataUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await personalBookDataRepository.readPersonalBookDataByBookDataId(context, bookDataId);
      const currentData = transformPersonalBookDataUpdateFromPersonalBookData(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, dateRead } = mergedUpdateData;

      if (isNull(comment) && isNull(dateRead)) {
        await context.executeQuery(
          personalBookDataQueries.deletePersonalBookData,
          stringifyParams(bookDataId),
        );
        return constructDeleteMessage(personalBookDataRepository.name, bookDataId);
      }

      const row = await context.executeSingleResultQuery(
        personalBookDataQueries.updatePersonalBookData,
        stringifyParams(bookDataId, dateRead, comment),
      );

      return createPersonalBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
