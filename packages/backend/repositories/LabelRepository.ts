import { Label } from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { labelQueries } from '../db/queries/labelQueries';
import { createLabelFromDbRow, transformLabelUpdateFromLabel } from '../db/transformations/labelTransformation';
import { checkLabelCreate, checkLabelUpdate } from '../checks/labelCheck';


interface LabelRepository extends Repository {
  createLabel: CreateActionWithContext<Label>;
  readLabelById: ReadActionWithContext<Label>;
  readAllLabels: ReadAllActionWithContext<Label>;
  updateLabel: UpdateActionWithContext<Label>;
}

export const labelRepository: LabelRepository = {
  name: 'Label',

  createLabel: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(labelRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(labelQueries.createLabel, stringifyParams(checked.userId, checked.name, checked.description));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readLabelById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(labelRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(labelQueries.getLabelById, stringifyParams(id));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllLabels: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(labelRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(labelQueries.getAllLabels);

      return createArrayFromDbRows(rows, createLabelFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateLabel: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(labelRepository.name, ErrorMethod.Update);

    const { checked, checkError } = checkLabelUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await labelRepository.readLabelById(context, id);
      const currentData = transformLabelUpdateFromLabel(current);
      const mergedUpdateData = merge(currentData, checked);

      const { name, description } = mergedUpdateData;
      const row = await context.transaction.executeSingleResultQuery(labelQueries.updateLabel, stringifyParams(id, name, description));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
