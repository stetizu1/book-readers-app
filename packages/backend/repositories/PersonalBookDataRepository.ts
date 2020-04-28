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

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkPersonalBookDataCreate, checkPersonalBookDataUpdate } from '../checks/invalid/personalBookData';
import { personalBookDataQueries } from '../db/queries/personalBookDataQueries';

import {
  convertPersonalBookDataFromDbRow,
  convertPersonalBookDataToPersonalBookDataUpdate,
} from '../db/transformations/personalBookDataTransformation';
import { checkPermissionBookData } from '../checks/forbidden/bookData';


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
      await checkPermissionBookData.isOwner(context, loggedUserId, personalBookDataCreate.bookDataId);

      return await context.executeSingleResultQuery(
        convertPersonalBookDataFromDbRow,
        personalBookDataQueries.createPersonalBookData, personalBookDataCreate.bookDataId, personalBookDataCreate.dateRead, personalBookDataCreate.comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(personalBookDataRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readPersonalBookDataByBookDataId: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);

      return await context.executeSingleResultQuery(
        convertPersonalBookDataFromDbRow,
        personalBookDataQueries.getPersonalBookDataByBookDataId, bookDataId,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(personalBookDataRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updatePersonalBookData: async (context, loggedUserId, param, body) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);

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
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(personalBookDataRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deletePersonalBookData: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);

      return await context.executeSingleResultQuery(convertPersonalBookDataFromDbRow, personalBookDataQueries.deletePersonalBookData, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(personalBookDataRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
