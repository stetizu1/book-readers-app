import { Label } from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkLabelCreate, checkLabelUpdate } from '../checks/labelCheck';
import { labelQueries } from '../db/queries/labelQueries';
import { createLabelFromDbRow, transformLabelUpdateFromLabel } from '../db/transformations/labelTransformation';


interface LabelRepository extends Repository {
  createLabel: CreateActionWithContext<Label>;
  readLabelById: ReadActionWithContext<Label>;
  readAllLabels: ReadAllActionWithContext<Label>;
  updateLabel: UpdateActionWithContext<Label>;
}

export const labelRepository: LabelRepository = {
  name: RepositoryName.label,

  createLabel: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(labelRepository.name, body);

    const { checked, checkError } = checkLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.executeSingleResultQuery(labelQueries.createLabel, stringifyParams(checked.userId, checked.name, checked.description));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readLabelById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(labelRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(labelQueries.getLabelById, stringifyParams(id));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllLabels: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(labelRepository.name);

    try {
      const rows = await context.executeQuery(labelQueries.getAllLabels);

      return createArrayFromDbRows(rows, createLabelFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateLabel: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(labelRepository.name, id, body);

    const { checked, checkError } = checkLabelUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await labelRepository.readLabelById(context, id);
      const currentData = transformLabelUpdateFromLabel(current);
      const mergedUpdateData = merge(currentData, checked);

      const { name, description } = mergedUpdateData;
      const row = await context.executeSingleResultQuery(labelQueries.updateLabel, stringifyParams(id, name, description));
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
