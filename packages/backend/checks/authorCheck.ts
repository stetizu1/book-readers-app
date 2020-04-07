import { AuthorCreate, isAuthorCreate } from '../../shared/types/Author';
import { isValidName } from '../helpers/validators';
import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';


interface CheckResult {
  authorCreate: AuthorCreate | false;
  message?: string;
}

export const checkAuthorCreate = (body: unknown): CheckResult => {
  if (!isAuthorCreate(body)) {
    return {
      authorCreate: false,
      message: `${INVALID_STRUCTURE}`,
    };
  }
  if (!isValidName(body.name)) {
    return {
      authorCreate: false,
      message: `${EMPTY_STRING}`,
    };
  }
  return {
    authorCreate: body,
  };
};
