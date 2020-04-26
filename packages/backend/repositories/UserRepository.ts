import { User } from 'book-app-shared/types/User';
import { isValidId } from 'book-app-shared/helpers/validators';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  UnauthorizedCreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkUserCreate, checkUserUpdate } from '../checks/userCheck';
import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow, transformUserUpdateFromUser } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';


interface UserRepository extends Repository {
  createUser: UnauthorizedCreateActionWithContext<User>;

  readUserById: ReadActionWithContext<User>;
  readAllUsers: ReadAllActionWithContext<User>;
  updateUser: UpdateActionWithContext<User>;
  deleteUser: DeleteActionWithContext<User>;
}

export const userRepository: UserRepository = {
  name: RepositoryName.user,

  createUser: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(userRepository.name, body);

    // TODO: Solve google token
    const checked = checkUserCreate(body, errPrefix, errPostfix);

    const {
      email, publicProfile, password, name, description, image,
    } = checked;

    try {
      return await context.executeSingleResultQuery(createUserFromDbRow, userQueries.createUser, email, publicProfile, password, name, description, image);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(createUserFromDbRow, userQueries.getUserById, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);

    try {
      return await context.executeQuery(createUserFromDbRow, userQueries.getAllUsers);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(userRepository.name, id, body);

    const checked = checkUserUpdate(body, errPrefix, errPostfix);

    try {
      const current = await userRepository.readUserById(context, loggedUserId, id);
      const currentData = transformUserUpdateFromUser(current);
      const mergedUpdateData = merge(currentData, checked);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      return isUndefined(checked.password)
        ? await context.executeSingleResultQuery(createUserFromDbRow, userQueries.updateUserWithoutPasswordChange, id, publicProfile, name, description, image)
        : await context.executeSingleResultQuery(createUserFromDbRow, userQueries.updateUserWithPasswordChange, id, publicProfile, name, description, image, checked.password);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteUser: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const user = await context.executeSingleResultQuery(createUserFromDbRow, userQueries.deleteUser, id);
      await context.executeQuery(createBookRequestFromDbRow, bookRequestQueries.deleteRequestsCreatedByDeletedUser, id);
      return user;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
