import { User } from 'book-app-shared/types/User';
import { isValidEmail, isValidId } from 'book-app-shared/helpers/validators';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';
import { CheckResultMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext, UnauthorizedReadActionWithContext, UnauthorizedCreateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkUserCreate, checkUserUpdate } from '../checks/userCheck';
import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow, transformUserUpdateFromUser } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';


interface UserRepository extends Repository {
  readUserByEmail: UnauthorizedReadActionWithContext<User>;
  createUser: UnauthorizedCreateActionWithContext<User>;

  readUserById: ReadActionWithContext<User>;
  readAllUsers: ReadAllActionWithContext<User>;
  updateUser: UpdateActionWithContext<User>;
  deleteUser: DeleteActionWithContext<User>;
}

export const userRepository: UserRepository = {
  name: RepositoryName.user,
  readUserByEmail: async (context, email) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, email);

    if (!isValidEmail(email)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, CheckResultMessage.invalidEmail));
    }

    try {
      const row = await context.executeSingleResultQuery(userQueries.getUserByEmail, email);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  createUser: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(userRepository.name, body);

    // TODO: Solve google token
    const { checked, checkError } = checkUserCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      email, publicProfile, password, name, description, image,
    } = checked;

    try {
      const userRow = await context.executeSingleResultQuery(userQueries.createUser, email, publicProfile, password, name, description, image);
      return createUserFromDbRow(userRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(userQueries.getUserById, id);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);

    try {
      const rows = await context.executeQuery(userQueries.getAllUsers);
      return createArrayFromDbRows(rows, createUserFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(userRepository.name, id, body);

    const { checked, checkError } = checkUserUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await userRepository.readUserById(context, loggedUserId, id);
      const currentData = transformUserUpdateFromUser(current);
      const mergedUpdateData = merge(currentData, checked);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      const row = isUndefined(checked.password)
        ? await context.executeSingleResultQuery(userQueries.updateUserWithoutPasswordChange, id, publicProfile, name, description, image)
        : await context.executeSingleResultQuery(userQueries.updateUserWithPasswordChange, id, publicProfile, name, description, image, checked.password);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteUser: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeQuery(userQueries.deleteUser, id);
      await context.executeQuery(bookRequestQueries.deleteRequestsCreatedByDeletedUser, id);
      return createUserFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
