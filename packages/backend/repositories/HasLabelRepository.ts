import { HasLabel } from 'book-app-shared/types/HasLabel';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../types/actionTypes';

import { processTransactionError } from '../helpers/errors/processTransactionError';
import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';

import { checkHasLabel } from '../checks/invalid/hasLabel';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { convertHasLabelToDbRow } from '../db/transformations/hasLabelTransformation';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkPermissionHasLabel } from '../checks/forbidden/hasLabel';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
  deleteHasLabel: DeleteWithBodyActionWithContext<HasLabel>;
}

export const hasLabelRepository: HasLabelRepository = {
  name: RepositoryName.hasLabel,

  createHasLabel: async (context, loggedUserId, body) => {
    try {
      const hasLabel = checkHasLabel(body);
      await checkPermissionHasLabel.create(context, loggedUserId, hasLabel);

      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.createHasLabel, hasLabel.bookDataId, hasLabel.labelId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionHasLabel.read(context, loggedUserId, bookDataId);
      return await context.executeQuery(convertHasLabelToDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(hasLabelRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteHasLabel: async (context, loggedUserId, body) => {
    try {
      const hasLabel = checkHasLabel(body);
      await checkPermissionHasLabel.delete(context, loggedUserId, hasLabel);
      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.deleteHasLabel, hasLabel.bookDataId, hasLabel.labelId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.deleteWithBody(hasLabelRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
