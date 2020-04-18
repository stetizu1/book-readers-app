import { UserData } from 'book-app-shared/types/UserData';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';

import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow } from '../db/transformations/userTransformation';
import { checkUserCreate } from '../checks/userCheck';


interface UserRepository extends Repository {
  createUser: CreateActionWithContext<UserData>;
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
};
