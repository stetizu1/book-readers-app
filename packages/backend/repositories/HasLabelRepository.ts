import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';
import { checkHasLabelCreate } from '../checks/hasLabelCheck';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
}

export const hasLabelRepository: HasLabelRepository = {
  name: 'HasLabel',

  createHasLabel: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(hasLabelRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkHasLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(hasLabelQueries.createHasLabel, stringifyParams(checked.bookDataId, checked.labelId));
      return createHasLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(hasLabelRepository.name, ErrorMethod.Read, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const rows = await context.transaction.executeQuery(hasLabelQueries.getHasLabelsByBookDataId, stringifyParams(bookDataId));
      return createArrayFromDbRows(rows, createHasLabelFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
