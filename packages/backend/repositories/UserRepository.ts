import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertUserToUserUpdate } from 'book-app-shared/helpers/convert-to-update/user';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UnauthorizedCreateActionWithContext, UnauthorizedReadActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkUserCreate, checkUserUpdate } from '../checks/invalid/user';
import { userQueries } from '../db/queries/userQueries';
import { convertDbRowToUser } from '../db/transformations/userTransformation';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { convertDbRowToBookRequest } from '../db/transformations/bookRequestTransformation';
import { checkParameterEmail } from '../checks/parameter/checkParameterEmail';
import { checkPermissionUser } from '../checks/forbidden/user';


interface UserRepository extends Repository {
  createUser: UnauthorizedCreateActionWithContext<User>;
  readUserByEmail: UnauthorizedReadActionWithContext<User>;

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
      const {
        email, publicProfile, password, name, description, image, googleToken,
      } = userCreate;
      await checkPermissionUser.create(googleToken, email);

      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.createUser, email.toLowerCase(), publicProfile, password, name, description, image);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(userRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      await checkPermissionUser.read(context, loggedUserId, id);
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllUsers: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToUser, userQueries.getAllFriendUsers, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(userRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateUser: async (context, loggedUserId, param, body) => {
    try {
      const id = checkParameterId(param);
      const userUpdate = checkUserUpdate(body);
      await checkPermissionUser.update(loggedUserId, id);

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
      await checkPermissionUser.delete(loggedUserId, id);

      await context.executeQuery(convertDbRowToBookRequest, bookRequestQueries.deleteRequestsCreatedByDeletedUser, id);
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.deleteUser, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readUserByEmail: async (context, param) => {
    try {
      const email = checkParameterEmail(param).toLowerCase();
      return await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserByEmail, email);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(userRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
