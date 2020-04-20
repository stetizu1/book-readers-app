import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext } from '../types/actionTypes';

import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';

import { checkHasLabelCreate } from '../checks/hasLabelCheck';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';


interface HasLabelRepository extends Repository {
  createHasLabel: CreateActionWithContext<HasLabel>;
  readHasLabelsByBookDataId: ReadActionWithContext<HasLabel[]>;
}

export const hasLabelRepository: HasLabelRepository = {
  name: RepositoryName.hasLabel,

  createHasLabel: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, body);

    const { checked, checkError } = checkHasLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.executeSingleResultQuery(hasLabelQueries.createHasLabel, stringifyParams(checked.bookDataId, checked.labelId));
      return createHasLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readHasLabelsByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(hasLabelRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const rows = await context.executeQuery(hasLabelQueries.getHasLabelsByBookDataId, stringifyParams(bookDataId));
      return createArrayFromDbRows(rows, createHasLabelFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
