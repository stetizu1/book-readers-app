import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
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
  updatePersonalBookData: UpdateActionWithContext<PersonalBookData>;
  deletePersonalBookData: DeleteActionWithContext<PersonalBookData>;
}

export const personalBookDataRepository: PersonalBookDataRepository = {
  name: RepositoryName.personalBookData,

  createPersonalBookData: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(personalBookDataRepository.name, body);

    const checked = checkPersonalBookDataCreate(body, errPrefix, errPostfix);

    try {
      return await context.executeSingleResultQuery(
        createPersonalBookDataFromDbRow,
        personalBookDataQueries.createPersonalBookData, checked.bookDataId, checked.dateRead, checked.comment,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readPersonalBookDataByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(personalBookDataRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(
        createPersonalBookDataFromDbRow,
        personalBookDataQueries.getPersonalBookDataByBookDataId, bookDataId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updatePersonalBookData: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(personalBookDataRepository.name, bookDataId, body);

    const checked = checkPersonalBookDataUpdate(body, errPrefix, errPostfix);

    try {
      const current = await personalBookDataRepository.readPersonalBookDataByBookDataId(context, loggedUserId, bookDataId);
      const currentData = transformPersonalBookDataUpdateFromPersonalBookData(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, dateRead } = mergedUpdateData;

      if (isNull(comment) && isNull(dateRead)) {
        await context.executeSingleResultQuery(
          createPersonalBookDataFromDbRow,
          personalBookDataQueries.deletePersonalBookData,
          bookDataId,
        );
        return { bookDataId: current.bookDataId, dateRead: null, comment: null };
      }

      return await context.executeSingleResultQuery(
        createPersonalBookDataFromDbRow,
        personalBookDataQueries.updatePersonalBookData,
        bookDataId, dateRead, comment,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deletePersonalBookData: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(personalBookDataRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(createPersonalBookDataFromDbRow, personalBookDataQueries.deletePersonalBookData, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
