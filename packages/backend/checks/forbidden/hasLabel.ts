import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

import { bookDataQueries } from '../../db/queries/bookDataQueries';
import { labelQueries } from '../../db/queries/labelQueries';
import { convertDbRowToBookData } from '../../db/transformations/bookDataTransformation';
import { convertDbRowToLabel } from '../../db/transformations/labelTransformation';


const hasPermissionHasLabel = async (context: Transaction, loggedUserId: number, bookDataId: number, labelId?: number): Promise<boolean> => {
  const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
  if (bookData.userId !== loggedUserId) {
    throw new ForbiddenError();
  }
  if (!isUndefined(labelId)) {
    const label = await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.getLabelById, labelId);
    if (label.userId !== loggedUserId) {
      throw new ForbiddenError();
    }
  }
  return true;
};


interface CheckPermissionHasLabel {
  create: (context: Transaction, loggedUserId: number, hasLabel: HasLabel) => Promise<boolean>;
  read: (context: Transaction, loggedUserId: number, bookDataId: number) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, hasLabel: HasLabel) => Promise<boolean>;
}

export const checkPermissionHasLabel: CheckPermissionHasLabel = {
  create: async (context, loggedUserId, hasLabel) => (
    hasPermissionHasLabel(context, loggedUserId, hasLabel.bookDataId, hasLabel.labelId)
  ),

  read: async (context, loggedUserId, bookDataId) => (
    hasPermissionHasLabel(context, loggedUserId, bookDataId)
  ),

  delete: async (context, loggedUserId, hasLabel) => (
    hasPermissionHasLabel(context, loggedUserId, hasLabel.bookDataId, hasLabel.labelId)
  ),
};
