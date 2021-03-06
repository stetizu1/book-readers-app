import { Label } from 'book-app-shared/types/Label';
import { convertLabelToLabelUpdate } from 'book-app-shared/helpers/convert-to-update/label';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkLabelCreate, checkLabelUpdate } from '../checks/invalid/label';
import { labelQueries } from '../db/queries/labelQueries';
import { convertDbRowToLabel } from '../db/transformations/labelTransformation';
import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkPermissionLabel } from '../checks/forbidden/label';


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
    try {
      const labelCreate = checkLabelCreate(body);
      return await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.createLabel, loggedUserId, labelCreate.name, labelCreate.description);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(labelRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readLabelById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      await checkPermissionLabel.read(context, loggedUserId, id);
      return await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.getLabelById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(labelRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllLabels: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToLabel, labelQueries.getAllLabels, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(labelRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateLabel: async (context, loggedUserId, param, body) => {
    try {
      const id = checkParameterId(param);
      await checkPermissionLabel.update(context, loggedUserId, id);
      const labelUpdate = checkLabelUpdate(body);
      const current = await labelRepository.readLabelById(context, loggedUserId, id);
      const currentData = convertLabelToLabelUpdate(current);
      const mergedUpdateData = merge(currentData, labelUpdate);

      const { name, description } = mergedUpdateData;
      return await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.updateLabel, id, name, description);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(labelRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteLabel: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      await checkPermissionLabel.delete(context, loggedUserId, id);
      return await context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.deleteLabel, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(labelRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
