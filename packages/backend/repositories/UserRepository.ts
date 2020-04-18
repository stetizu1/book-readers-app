import { UserData } from 'book-app-shared/types/UserData';
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


import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow, transformUserUpdateFromUser } from '../db/transformations/userTransformation';
import { checkUserCreate, checkUserUpdate } from '../checks/userCheck';
import { merge } from '../helpers/db/merge';


interface UserRepository extends Repository {
  createUser: CreateActionWithContext<UserData>;
  readUserById: ReadActionWithContext<UserData>;
  readAllUsers: ReadAllActionWithContext<UserData>;
  updateUser: UpdateActionWithContext<UserData>;
}

export const userRepository: UserRepository = {
  name: 'User',

  createUser: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(userRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkUserCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      email, publicProfile, password, name, description, image,
    } = checked;

    try {
      const userRow = await context.transaction.executeSingleResultQuery(userQueries.createUser, stringifyParams(email, publicProfile, password, name, description, image));
      return createUserFromDbRow(userRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(userRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(userQueries.getUserById, stringifyParams(id));
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(userRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(userQueries.getAllUsers);
      return createArrayFromDbRows(rows, createUserFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(userRepository.name, ErrorMethod.Update, id, body);

    const { checked, checkError } = checkUserUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const currentUser = await userRepository.readUserById(context, id);
      const currentData = transformUserUpdateFromUser(currentUser);
      const mergedUpdateData = merge(currentData, checked);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      const [query, params] = checked.password === undefined
        ? [userQueries.updateUserWithoutPasswordChange, stringifyParams(id, publicProfile, name, description, image)]
        : [userQueries.updateUserWithPasswordChange, stringifyParams(id, publicProfile, name, description, image, checked.password)];
      const row = await context.transaction.executeSingleResultQuery(query, params);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
