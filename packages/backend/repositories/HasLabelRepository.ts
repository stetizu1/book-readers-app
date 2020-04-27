import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

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
import { convertHasLabelToDbRow } from '../db/transformations/hasLabelTransformation';

import { bookDataQueries } from '../db/queries/bookDataQueries';
import { labelQueries } from '../db/queries/labelQueries';
import { convertDbRowToBookData } from '../db/transformations/bookDataTransformation';
import { convertDbRowToLabel } from '../db/transformations/labelTransformation';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
  deleteHasLabel: DeleteWithBodyActionWithContext<HasLabel>;
}

const hasPermissionBookData = async (context: Transaction, loggedUserId: number, bookDataId: number): Promise<boolean> => {
  const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
  return bookData.userId === loggedUserId;
};

const hasPermissionLabel = async (context: Transaction, loggedUserId: number, labelId: number): Promise<boolean> => {
  const label = await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.getLabelById, labelId);
  return label.userId === loggedUserId;
};

export const hasLabelRepository: HasLabelRepository = {
  name: RepositoryName.hasLabel,

  createHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);

    const checked = checkHasLabel(body, errPrefix, errPostfix);

    if (!(await hasPermissionBookData(context, loggedUserId, checked.bookDataId))
    || !(await hasPermissionLabel(context, loggedUserId, checked.labelId))) {
      return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.createHasLabel, checked.bookDataId, checked.labelId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      if (!(await hasPermissionBookData(context, loggedUserId, Number(bookDataId)))) {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }
      return await context.executeQuery(convertHasLabelToDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteHasLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.deleteWithBody(hasLabelRepository.name, body);

    const checked = checkHasLabel(body, errPrefix, errPostfix);

    if (!(await hasPermissionBookData(context, loggedUserId, checked.bookDataId))
      || !(await hasPermissionLabel(context, loggedUserId, checked.labelId))) {
      return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.deleteHasLabel, checked.bookDataId, checked.labelId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
