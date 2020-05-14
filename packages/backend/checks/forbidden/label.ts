import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http-errors/ForbiddenError';

import { labelQueries } from '../../db/queries/labelQueries';
import { convertDbRowToLabel } from '../../db/transformations/labelTransformation';


const hasPermissionLabelId = async (context: Transaction, loggedUserId: number, labelId: number): Promise<boolean> => {
  const label = await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.getLabelById, labelId);
  if (label.userId !== loggedUserId) {
    throw new ForbiddenError();
  }
  return true;
};


interface CheckPermissionLabel {
  read: (context: Transaction, loggedUserId: number, labelId: number) => Promise<boolean>;
  update: (context: Transaction, loggedUserId: number, labelId: number) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, labelId: number) => Promise<boolean>;
}

export const checkPermissionLabel: CheckPermissionLabel = {
  read: async (context, loggedUserId, labelId) => (
    hasPermissionLabelId(context, loggedUserId, labelId)
  ),

  update: async (context, loggedUserId, labelId) => (
    hasPermissionLabelId(context, loggedUserId, labelId)
  ),

  delete: async (context, loggedUserId, labelId) => (
    hasPermissionLabelId(context, loggedUserId, labelId)
  ),
};
