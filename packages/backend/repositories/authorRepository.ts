import { Author } from '../../shared/types/Author';
import { CreateActionWithContext } from '../constants/ActionTypes';
import { checkAuthorCreate } from '../checks/authorCheck';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { stringifyParams } from '../helpers/stringifyParams';
import { authorQueries } from '../db/queries/authorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';
import { isUniqueViolation } from '../db/errors';
import { ConflictError } from '../httpErrors/ConflictError';
import {
  composeMessage,
  CREATE_ERROR,
  INVALID_STRUCTURE,
  REPO_ERROR_PREFIX,
  STRUCTURE_GIVEN,
  UNIQUE_VIOLATION,
} from '../constants/errorMessages';

const REPO_NAME = 'Author';

export class AuthorRepository {
  static createAuthor: CreateActionWithContext<Author> = async (context, body) => {
    const errPrefix = `${REPO_ERROR_PREFIX(REPO_NAME)} ${CREATE_ERROR}`;
    const errPostfix = `${STRUCTURE_GIVEN} ${JSON.stringify(body)}`;

    const { authorCreate, message } = checkAuthorCreate(body);
    if (!authorCreate) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, message, errPostfix)));


    const params = stringifyParams(authorCreate.name);

    try {
      const row = await context.transaction.executeSingleResultQuery(authorQueries.createAuthor, params);
      return createAuthorFromDbRow(row);
    } catch (error) {
      console.error(error, error.message);

      if (isUniqueViolation(error)) {
        return Promise.reject(new ConflictError(composeMessage(errPrefix, UNIQUE_VIOLATION, errPostfix)));
      }
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };
}
