import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ForbiddenMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Transaction } from '../types/transaction/Transaction';
import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../types/actionTypes';

import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';

import { checkHasLabel } from '../checks/hasLabelCheck';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';

import { createBookDataFromDbRow } from '../db/transformations/bookDataTransformation';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import { createLabelFromDbRow } from '../db/transformations/labelTransformation';
import { labelQueries } from '../db/queries/labelQueries';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
  deleteHasLabel: DeleteWithBodyActionWithContext<HasLabel>;
}

const hasPermissionBookData = async (context: Transaction, loggedUserId: number, bookDataId: number): Promise<boolean> => {
  const bookData = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, bookDataId);
  return bookData.userId === loggedUserId;
};

const hasPermissionLabel = async (context: Transaction, loggedUserId: number, labelId: number): Promise<boolean> => {
  const label = await context.executeSingleResultQuery(createLabelFromDbRow, labelQueries.getLabelById, labelId);
  return label.userId === loggedUserId;
};

export const hasLabelRepository: HasLabelRepository = {
  name: RepositoryName.hasLabel,

  createHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);

    const checked = checkHasLabel(body, errPrefix, errPostfix);

    if (!(await hasPermissionBookData(context, loggedUserId, checked.bookDataId))
    || !await hasPermissionLabel(context, loggedUserId, checked.labelId)) {
      return Promise.reject(getHttpError.getForbiddenError(ForbiddenMessage.notQualifiedForAction, errPrefix, errPostfix));
    }

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
      if (!(await hasPermissionBookData(context, loggedUserId, Number(bookDataId)))) {
        return Promise.reject(getHttpError.getForbiddenError(ForbiddenMessage.notQualifiedForAction, errPrefix, errPostfix));
      }
      return await context.executeQuery(createHasLabelFromDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.deleteWithBody(hasLabelRepository.name, body);

    const checked = checkHasLabel(body, errPrefix, errPostfix);

    if (!(await hasPermissionBookData(context, loggedUserId, checked.bookDataId))
      || !await hasPermissionLabel(context, loggedUserId, checked.labelId)) {
      return Promise.reject(getHttpError.getForbiddenError(ForbiddenMessage.notQualifiedForAction, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.deleteHasLabel, checked.bookDataId, checked.labelId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
