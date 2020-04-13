import { UserData } from 'book-app-shared/types/UserData';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

import { UserQueries } from '../db/queries/UserQueries';
import { createUserFromDbRow } from '../db/transformations/userTransformation';
import { checkUserCreate } from '../checks/userCheck';


export class UserRepository {
  static REPO_NAME = 'User';

  static createUser: CreateActionWithContext<UserData> = async (context, body): Promise<UserData> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(UserRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkUserCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      email, publicProfile, password, name, description, image,
    } = checked;

    try {
      const userRow = await context.transaction.executeSingleResultQuery(UserQueries.createUser, stringifyParams(email, publicProfile, password, name, description, image));
      return createUserFromDbRow(userRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
