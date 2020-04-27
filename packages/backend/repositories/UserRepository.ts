import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  UnauthorizedCreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkUserCreate, checkUserUpdate } from '../checks/body/user';
import { userQueries } from '../db/queries/userQueries';
import { convertDbRowToUser, convertUserToUserUpdate } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { convertDbRowToBookRequest } from '../db/transformations/bookRequestTransformation';


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
    try {
      const userCreate = checkUserCreate(body);
      // TODO: Solve google token
      const {
        email, publicProfile, password, name, description, image,
      } = userCreate;
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.createUser, email.toLowerCase(), publicProfile, password, name, description, image);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(userRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToUser, userQueries.getAllUsers);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, loggedUserId, id, body) => {
    try {
      const checked = checkUserUpdate(body);
      const current = await userRepository.readUserById(context, loggedUserId, id);
      const currentData = convertUserToUserUpdate(current);
      const mergedUpdateData = merge(currentData, checked);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      return isUndefined(checked.password)
        ? await context.executeSingleResultQuery(convertDbRowToUser, userQueries.updateUserWithoutPasswordChange, id, publicProfile, name, description, image)
        : await context.executeSingleResultQuery(convertDbRowToUser, userQueries.updateUserWithPasswordChange, id, publicProfile, name, description, image, checked.password);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(userRepository.name, id, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteUser: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      const user = await context.executeSingleResultQuery(convertDbRowToUser, userQueries.deleteUser, id);
      await context.executeQuery(convertDbRowToBookRequest, bookRequestQueries.deleteRequestsCreatedByDeletedUser, id);
      return user;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
