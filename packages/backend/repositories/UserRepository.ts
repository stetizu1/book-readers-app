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
import { checkUserCreate, checkUserUpdate } from '../checks/invalid/user';
import { userQueries } from '../db/queries/userQueries';
import { convertDbRowToUser, convertUserToUserUpdate } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { convertDbRowToBookRequest } from '../db/transformations/bookRequestTransformation';
import { checkParameterEmail } from '../checks/parameter/checkParameterEmail';


interface UserRepository extends Repository {
  createUser: UnauthorizedCreateActionWithContext<User>;

  readUserById: ReadActionWithContext<User>;
  readUserByEmail: ReadActionWithContext<User>;
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

  readUserById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context) => {
    try {
      return await context.executeQuery(convertDbRowToUser, userQueries.getAllUsers);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, loggedUserId, param, body) => {
    try {
      const id = checkParameterId(param);
      const userUpdate = checkUserUpdate(body);
      const current = await userRepository.readUserById(context, loggedUserId, id);
      const currentData = convertUserToUserUpdate(current);
      const mergedUpdateData = merge(currentData, userUpdate);

      const {
        publicProfile, name, description, image,
      } = mergedUpdateData;
      return isUndefined(userUpdate.password)
        ? await context.executeSingleResultQuery(convertDbRowToUser, userQueries.updateUserWithoutPasswordChange, id, publicProfile, name, description, image)
        : await context.executeSingleResultQuery(convertDbRowToUser, userQueries.updateUserWithPasswordChange, id, publicProfile, name, description, image, userUpdate.password);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(userRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteUser: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      const user = await context.executeSingleResultQuery(convertDbRowToUser, userQueries.deleteUser, id);
      await context.executeQuery(convertDbRowToBookRequest, bookRequestQueries.deleteRequestsCreatedByDeletedUser, id);
      return user;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserByEmail: async (context, loggedUserId, param) => {
    try {
      const email = checkParameterEmail(param).toLowerCase();
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserByEmail, email);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
