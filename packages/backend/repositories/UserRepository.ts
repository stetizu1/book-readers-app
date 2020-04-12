import { UserData } from 'book-app-shared/types/UserData';

import { CreateActionWithContext } from '../constants/actionTypes';
import {
  composeMessage, addRepoPrefix,
  CREATE_ERROR, INVALID_STRUCTURE, STRUCTURE_GIVEN, UNIQUE_VIOLATION,
} from '../constants/errorMessages';
import { isUniqueViolation } from '../db/errors';
import { ConflictError } from '../httpErrors/ConflictError';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { stringifyParams } from '../helpers/stringifyParams';

import { UserQueries } from '../db/queries/UserQueries';
import { createUserFromDbRow } from '../db/transformations/userTransformation';
import { checkUserCreate } from '../checks/userCheck';


export class UserRepository {
  static REPO_NAME = 'User';

  static createUser: CreateActionWithContext<UserData> = async (context, body): Promise<UserData> => {
    const errPrefix = `${addRepoPrefix(UserRepository.REPO_NAME)} ${CREATE_ERROR}`;
    const errPostfix = `${STRUCTURE_GIVEN} ${JSON.stringify(body)}`;

    const { checked, message } = checkUserCreate(body);
    if (!checked) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, message, errPostfix)));

    const {
      email, publicProfile, password, name, description, image,
    } = checked;
    const params = stringifyParams(email, publicProfile, password, name, description, image);

    try {
      const userRow = await context.transaction.executeSingleResultQuery(UserQueries.createUser, params);
      return createUserFromDbRow(userRow);
    } catch (error) {
      console.error(error, error.message);

      if (isUniqueViolation(error)) {
        return Promise.reject(new ConflictError(composeMessage(errPrefix, UNIQUE_VIOLATION, errPostfix)));
      }
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };
}
