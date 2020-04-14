import { HasLabel } from 'book-app-shared/types/HasLabel';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

import { HasLabelQueries } from '../db/queries/HasLabelQueries';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';
import { checkHasLabelCreate } from '../checks/hasLabelCheck';


export class HasLabelRepository {
  static REPO_NAME = 'HasLabel';

  static createHasLabel: CreateActionWithContext<HasLabel> = async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(HasLabelRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkHasLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(HasLabelQueries.createHasLabel, stringifyParams(checked.bookDataId, checked.labelId));
      return createHasLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
