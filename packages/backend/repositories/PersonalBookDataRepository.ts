import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkPersonalBookDataCreate, checkPersonalBookDataUpdate } from '../checks/personalBookDataChecks';
import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';
import {
  convertPersonalBookDataFromDbRow,
  convertPersonalBookDataToPersonalBookDataUpdate,
} from '../db/transformations/personalBookDataTransformation';
import { checkParameterId } from '../checks/other/checkParameterId';


interface PersonalBookDataRepository extends Repository {
  createPersonalBookData: CreateActionWithContext<PersonalBookData>;
  readPersonalBookDataByBookDataId: ReadActionWithContext<PersonalBookData>;
  updatePersonalBookData: UpdateActionWithContext<PersonalBookData>;
  deletePersonalBookData: DeleteActionWithContext<PersonalBookData>;
}

export const personalBookDataRepository: PersonalBookDataRepository = {
  name: RepositoryName.personalBookData,

  createPersonalBookData: async (context, loggedUserId, body) => {
    try {
      const personalBookDataCreate = checkPersonalBookDataCreate(body);
      return await context.executeSingleResultQuery(
        convertPersonalBookDataFromDbRow,
        personalBookDataQueries.createPersonalBookData, personalBookDataCreate.bookDataId, personalBookDataCreate.dateRead, personalBookDataCreate.comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(personalBookDataRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readPersonalBookDataByBookDataId: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      return await context.executeSingleResultQuery(
        convertPersonalBookDataFromDbRow,
        personalBookDataQueries.getPersonalBookDataByBookDataId, bookDataId,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(personalBookDataRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updatePersonalBookData: async (context, loggedUserId, bookDataId, body) => {
    try {
      checkParameterId(bookDataId);
      const personalBookDataUpdate = checkPersonalBookDataUpdate(body);
      const current = await personalBookDataRepository.readPersonalBookDataByBookDataId(context, loggedUserId, bookDataId);
      const currentData = convertPersonalBookDataToPersonalBookDataUpdate(current);
      const mergedUpdateData = merge(currentData, personalBookDataUpdate);

      const { comment, dateRead } = mergedUpdateData;

      if (isNull(comment) && isNull(dateRead)) {
        await context.executeSingleResultQuery(
          convertPersonalBookDataFromDbRow,
          personalBookDataQueries.deletePersonalBookData,
          bookDataId,
        );
        return { bookDataId: current.bookDataId, dateRead: null, comment: null };
      }

      return await context.executeSingleResultQuery(
        convertPersonalBookDataFromDbRow,
        personalBookDataQueries.updatePersonalBookData,
        bookDataId, dateRead, comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(personalBookDataRepository.name, bookDataId, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deletePersonalBookData: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      return await context.executeSingleResultQuery(convertPersonalBookDataFromDbRow, personalBookDataQueries.deletePersonalBookData, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(personalBookDataRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
