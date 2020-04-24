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
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
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
  deleteLabel: DeleteActionWithContext<Label>;
}

export const labelRepository: LabelRepository = {
  name: RepositoryName.label,

  createLabel: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(labelRepository.name, body);

    const { checked, checkError } = checkLabelCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.executeSingleResultQuery(labelQueries.createLabel, checked.userId, checked.name, checked.description);
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readLabelById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(labelRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(labelQueries.getLabelById, id);
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllLabels: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(labelRepository.name);

    try {
      const rows = await context.executeQuery(labelQueries.getAllLabels);

      return createArrayFromDbRows(rows, createLabelFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateLabel: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(labelRepository.name, id, body);

    const { checked, checkError } = checkLabelUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await labelRepository.readLabelById(context, loggedUserId, id);
      const currentData = transformLabelUpdateFromLabel(current);
      const mergedUpdateData = merge(currentData, checked);

      const { name, description } = mergedUpdateData;
      const row = await context.executeSingleResultQuery(labelQueries.updateLabel, id, name, description);
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteLabel: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(labelRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(labelQueries.deleteLabel, id);
      return createLabelFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
