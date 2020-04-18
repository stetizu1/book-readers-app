import { UserData } from 'book-app-shared/types/UserData';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { createArrayFromDbRows } from '../db/createFromDbRow';


import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow } from '../db/transformations/userTransformation';
import { checkUserCreate } from '../checks/userCheck';


interface UserRepository extends Repository {
  createUser: CreateActionWithContext<UserData>;
  readUserById: ReadActionWithContext<UserData>;
  readAllUsers: ReadAllActionWithContext<UserData>;
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
};
