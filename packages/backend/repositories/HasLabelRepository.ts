import { HasLabel } from 'book-app-shared/types/HasLabel';

import { RepositoryName } from '../constants/RepositoryName';

import { Transaction } from '../types/transaction/Transaction';
import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../types/actionTypes';
import { ForbiddenError } from '../types/http_errors/ForbiddenError';

import { processTransactionError } from '../helpers/errors/processTransactionError';
import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';

import { checkHasLabel } from '../checks/body/hasLabel';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { convertHasLabelToDbRow } from '../db/transformations/hasLabelTransformation';

import { checkParameterId } from '../checks/parameter/checkParameterId';
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
    try {
      const hasLabel = checkHasLabel(body);

      if (!(await hasPermissionBookData(context, loggedUserId, hasLabel.bookDataId))
        || !(await hasPermissionLabel(context, loggedUserId, hasLabel.labelId))) {
        throw new ForbiddenError();
      }


      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.createHasLabel, hasLabel.bookDataId, hasLabel.labelId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      if (!(await hasPermissionBookData(context, loggedUserId, Number(bookDataId)))) {
        throw new ForbiddenError();
      }
      return await context.executeQuery(convertHasLabelToDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(hasLabelRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteHasLabel: async (context, loggedUserId, body) => {
    try {
      const hasLabel = checkHasLabel(body);

      if (!(await hasPermissionBookData(context, loggedUserId, hasLabel.bookDataId))
        || !(await hasPermissionLabel(context, loggedUserId, hasLabel.labelId))) {
        throw new ForbiddenError();
      }
      return await context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.deleteHasLabel, hasLabel.bookDataId, hasLabel.labelId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.deleteWithBody(hasLabelRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
