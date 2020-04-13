import { Label } from 'book-app-shared/types/Label';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

import { LabelQueries } from '../db/queries/LabelQueries';
import { createLabelFromDbRow } from '../db/transformations/labelTransformation';
import { checkLabelCreate } from '../checks/labelCheck';


export class LabelRepository {
  static REPO_NAME = 'Label';

  static createLabel: CreateActionWithContext<Label> = async (context, body): Promise<Label> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(LabelRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(LabelQueries.createLabel, stringifyParams(checked.userId, checked.name, checked.description));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
