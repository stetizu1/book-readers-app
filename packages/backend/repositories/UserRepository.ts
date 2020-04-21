import { User } from 'book-app-shared/types/User';
import { isValidId } from 'book-app-shared/helpers/validators';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

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
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkUserCreate, checkUserUpdate } from '../checks/userCheck';
import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow, transformUserUpdateFromUser } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';


interface UserRepository extends Repository {
  createUser: CreateActionWithContext<User>;
  readUserById: ReadActionWithContext<User>;
  readAllUsers: ReadAllActionWithContext<User>;
  updateUser: UpdateActionWithContext<User>;
  deleteUser: DeleteActionWithContext<User>;
}

export const userRepository: UserRepository = {
  name: RepositoryName.user,

  createUser: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(userRepository.name, body);

    const { checked, checkError } = checkUserCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      email, publicProfile, password, name, description, image,
    } = checked;

    try {
      const userRow = await context.executeSingleResultQuery(userQueries.createUser, stringifyParams(email, publicProfile, password, name, description, image));
      return createUserFromDbRow(userRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(userQueries.getUserById, stringifyParams(id));
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);

    try {
      const rows = await context.executeQuery(userQueries.getAllUsers);
      return createArrayFromDbRows(rows, createUserFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(userRepository.name, id, body);

    const { checked, checkError } = checkUserUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await userRepository.readUserById(context, id);
      const currentData = transformUserUpdateFromUser(current);
      const mergedUpdateData = merge(currentData, checked);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      const [query, params] = isUndefined(checked.password)
        ? [userQueries.updateUserWithoutPasswordChange, stringifyParams(id, publicProfile, name, description, image)]
        : [userQueries.updateUserWithPasswordChange, stringifyParams(id, publicProfile, name, description, image, checked.password)];
      const row = await context.executeSingleResultQuery(query, params);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteUser: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeQuery(userQueries.deleteUser, stringifyParams(id));
      await context.executeQuery(bookRequestQueries.deleteRequestsCreatedByDeletedUser, stringifyParams(id));
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
