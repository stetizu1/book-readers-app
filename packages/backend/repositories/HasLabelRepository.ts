import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../types/actionTypes';

import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkHasLabel } from '../checks/hasLabelCheck';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
  deleteHasLabel: DeleteWithBodyActionWithContext<HasLabel>;
}

export const hasLabelRepository: HasLabelRepository = {
  name: RepositoryName.hasLabel,

  createHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);

    const { checked, checkError } = checkHasLabel(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      return await context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.createHasLabel, checked.bookDataId, checked.labelId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      return await context.executeQuery(createHasLabelFromDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.deleteWithBody(hasLabelRepository.name, body);

    const { checked, checkError } = checkHasLabel(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      return await context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.deleteHasLabel, checked.bookDataId, checked.labelId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
